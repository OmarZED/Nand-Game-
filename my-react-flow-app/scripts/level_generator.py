import subprocess
import json
import re

def generate_level_prompt(level_number, previous_levels):
    return f"""Generate a complex level configuration for a logic gate game. Level {level_number}.
Previous levels: {', '.join(previous_levels)}.
Create a challenging level that requires at least 4 different types of gates and has a non-trivial solution.
The level should be more complex than previous levels and require creative thinking.

Output a JavaScript file that exports a level configuration object. The file should:
1. Import GATE_TYPES from './types'
2. Export a level configuration object
3. Include at least 4 different types of gates (e.g., NAND, AND, OR, XOR)
4. Have a complex truth table that requires multiple gate combinations
5. Position nodes in a way that makes the circuit clear but challenging
6. Include intermediate gates that must be connected in a specific order

Example format:
import {{ GATE_TYPES }} from './types';

export const level{level_number} = {{
    id: 'level{level_number}',
    title: 'Complex Gate Challenge',
    description: 'Create a circuit that implements a complex logic function using multiple gates. You must connect the gates in the correct order to achieve the desired output.',
    difficulty: 5,
    availableGates: [
        GATE_TYPES.INPUT,
        GATE_TYPES.OUTPUT,
        GATE_TYPES.AND,
        GATE_TYPES.OR,
        GATE_TYPES.NAND,
        GATE_TYPES.NOR,
        GATE_TYPES.XOR,
        GATE_TYPES.XNOR
    ],
    initialNodes: [
        {{
            id: 'input1',
            type: GATE_TYPES.INPUT,
            position: {{ x: 100, y: 100 }},
            data: {{ value: 0 }}
        }},
        {{
            id: 'input2',
            type: GATE_TYPES.INPUT,
            position: {{ x: 100, y: 300 }},
            data: {{ value: 0 }}
        }},
        {{
            id: 'nand1',
            type: GATE_TYPES.NAND,
            position: {{ x: 300, y: 100 }},
            data: {{ value: null }}
        }},
        {{
            id: 'and1',
            type: GATE_TYPES.AND,
            position: {{ x: 500, y: 200 }},
            data: {{ value: null }}
        }},
        {{
            id: 'or1',
            type: GATE_TYPES.OR,
            position: {{ x: 700, y: 200 }},
            data: {{ value: null }}
        }},
        {{
            id: 'output',
            type: GATE_TYPES.OUTPUT,
            position: {{ x: 900, y: 200 }},
            data: {{ value: null }}
        }}
    ],
    expectedTruthTable: [
        {{ input1: 0, input2: 0, output: 1 }},
        {{ input1: 0, input2: 1, output: 1 }},
        {{ input1: 1, input2: 0, output: 1 }},
        {{ input1: 1, input2: 1, output: 0 }}
    ]
}};

Make sure to:
1. Use proper JavaScript syntax (not JSON)
2. Include the import statement
3. Use GATE_TYPES constants
4. Create a complex circuit that requires multiple gate combinations
5. Position nodes in a way that makes the circuit clear but challenging
6. Include a detailed description of the challenge
7. Space out the nodes horizontally (x: 100, 300, 500, 700, 900) and vertically (y: 100, 200, 300)
8. Create a non-trivial truth table that requires careful gate connections
"""

def call_ollama(prompt):
    try:
        # Run Ollama directly with the prompt as part of the command
        result = subprocess.run(
            ['C:\\Users\\Omar\\AppData\\Local\\Programs\\Ollama\\ollama.exe', 'run', 'deepseek-r1', prompt],
            capture_output=True,
            text=True,
            encoding='utf-8',
            check=True
        )
        return result.stdout
    except Exception as e:
        print(f"Error calling Ollama: {e}")
        return None

def extract_js_from_response(response):
    # Find the JavaScript code block in the response
    js_match = re.search(r'import.*?};', response, re.DOTALL)
    if js_match:
        return js_match.group()
    return None

def validate_level_config(js_code):
    if not js_code:
        print("No JavaScript code found in response")
        return False
    
    # Check for required elements
    required_elements = [
        'import { GATE_TYPES }',
        'export const level',
        'id:',
        'title:',
        'description:',
        'difficulty:',
        'availableGates:',
        'initialNodes:',
        'expectedTruthTable:'
    ]
    
    for element in required_elements:
        if element not in js_code:
            print(f"Missing required element: {element}")
            return False
    
    # Check for proper gate types
    gate_types = [
        'GATE_TYPES.INPUT',
        'GATE_TYPES.OUTPUT',
        'GATE_TYPES.AND',
        'GATE_TYPES.OR',
        'GATE_TYPES.NAND',
        'GATE_TYPES.NOR',
        'GATE_TYPES.XOR',
        'GATE_TYPES.XNOR'
    ]
    
    gates_found = 0
    for gate in gate_types:
        if gate in js_code:
            gates_found += 1
    
    if gates_found < 4:
        print("Level must use at least 4 different types of gates")
        return False
    
    # Check node positions
    x_positions = re.findall(r'x:\s*(\d+)', js_code)
    if len(set(x_positions)) < 4:
        print("Nodes must be spaced out horizontally")
        return False
    
    # Check truth table complexity
    truth_table = re.search(r'expectedTruthTable:\s*\[(.*?)\]', js_code, re.DOTALL)
    if truth_table:
        entries = re.findall(r'{[^}]+}', truth_table.group(1))
        if len(entries) < 4:
            print("Truth table must include all input combinations")
            return False
    
    return True

def generate_level(level_number, previous_levels):
    prompt = generate_level_prompt(level_number, previous_levels)
    response = call_ollama(prompt)
    
    if response:
        js_code = extract_js_from_response(response)
        if js_code and validate_level_config(js_code):
            return js_code
        else:
            print("Invalid level configuration generated")
            return None
    return None

def save_level_config(js_code, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(js_code)

def main():
    # Example usage
    previous_levels = ['NOT', 'AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR']
    level_number = 9  # Next level number
    
    print(f"Generating level {level_number}...")
    js_code = generate_level(level_number, previous_levels)
    
    if js_code:
        filename = f"../src/levels/level{level_number}.js"
        save_level_config(js_code, filename)
        print(f"Level configuration saved to {filename}")
    else:
        print("Failed to generate valid level configuration")

if __name__ == "__main__":
    main() 