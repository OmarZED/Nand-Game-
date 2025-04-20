# Logic Gate Game Level Generator

This script uses Ollama with the deepseek-r1 model to generate new levels for the Logic Gate Game.

## Prerequisites

1. Install Ollama: https://ollama.ai/
2. Pull the deepseek-r1 model:
   ```bash
   ollama pull deepseek-r1
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. Navigate to the scripts directory:
   ```bash
   cd scripts
   ```

2. Run the level generator:
   ```bash
   python level_generator.py
   ```

3. The script will:
   - Generate a new level configuration
   - Validate the configuration
   - Save it to the appropriate location in the src/levels directory

## How it Works

1. The script creates a prompt for Ollama that includes:
   - Previous levels implemented
   - Required level structure
   - Level requirements and constraints

2. Ollama generates a response with a level configuration

3. The script:
   - Extracts JSON from the response
   - Validates the configuration
   - Saves it to a file

## Customization

You can modify the script to:
- Change the level requirements
- Adjust the difficulty progression
- Add new validation rules
- Modify the output format

## Example Output

The generated level will be saved in the format:
```javascript
export const level8 = {
  id: 'level8',
  title: 'Level Title',
  description: 'Level description...',
  difficulty: 3,
  availableGates: ['and', 'or', 'not'],
  initialNodes: [...],
  expectedTruthTable: [...]
};
``` 