const { VM } = require('vm2');
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Send code for execution against test cases
async function executeCode(code, testCases, language = 'javascript') {
  const results = {
    testsPassed: 0,
    testsFailed: 0,
    totalTests: testCases.length,
    results: [],
    error: null,
  };

  // Route to appropriate executor
  if (language === 'javascript') {
    return executeJavaScript(code, testCases);
  } else if (language === 'java') {
    return executeJava(code, testCases);
  } else if (language === 'c') {
    return executeC(code, testCases);
  } else if (language === 'cpp') {
    return executeCpp(code, testCases);
  } else {
    return {
      ...results,
      error: `Language "${language}" not supported yet. Supported: javascript, java, c, cpp`,
    };
  }

  try {
    // Create a VM sandbox for safe execution
    const vm = new VM({
      timeout: 5000,
      sandbox: {
        console: {
          log: () => {}, // Suppress console output
        },
      },
    });

    // Execute the user's code to define functions
    try {
      vm.run(code);
    } catch (err) {
      return {
        ...results,
        error: `Syntax Error: ${err.message}`,
      };
    }

    // Run each test case
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const testResult = {
        testNumber: i + 1,
        input: testCase.input,
        expected: testCase.expected_output,
        actual: null,
        passed: false,
        error: null,
      };

      try {
        // Parse input and expected output
        let input, expectedOutput;
        try {
          input = JSON.parse(testCase.input);
        } catch {
          input = testCase.input;
        }

        try {
          expectedOutput = JSON.parse(testCase.expected_output);
        } catch {
          expectedOutput = testCase.expected_output;
        }

        // Execute with test input
        let output;
        try {
          // Find the function name from the code (function name pattern)
          const functionMatch = code.match(
            /(?:function|const|let)\s+(\w+)\s*(?:=\s*\(|[=(])/
          );
          const functionName = functionMatch ? functionMatch[1] : null;

          if (!functionName) {
            throw new Error('Could not find function definition in code');
          }

          // Get the function from VM context
          const vmCode = code + `\nreturn ${functionName};`;
          const fn = vm.run(`(function() { ${vmCode} })()`);

          // Call the function with parsed input
          if (Array.isArray(input)) {
            output = fn(...input);
          } else {
            output = fn(input);
          }
        } catch (err) {
          testResult.error = err.message;
          results.testsFailed++;
          results.results.push(testResult);
          continue;
        }

        // Compare output
        const passed = JSON.stringify(output) === JSON.stringify(expectedOutput);
        testResult.passed = passed;
        testResult.actual = output;

        if (passed) {
          results.testsPassed++;
        } else {
          results.testsFailed++;
        }

        results.results.push(testResult);
      } catch (err) {
        testResult.error = err.message;
        results.testsFailed++;
        results.results.push(testResult);
      }
    }

    return results;
  } catch (err) {
    return {
      ...results,
      error: `Execution Error: ${err.message}`,
    };
  }
}

// JavaScript executor using vm2
function executeJavaScript(code, testCases) {
  const results = {
    testsPassed: 0,
    testsFailed: 0,
    totalTests: testCases.length,
    results: [],
    error: null,
  };

  try {
    // Create a VM sandbox for safe execution
    const vm = new VM({
      timeout: 5000,
      sandbox: {
        console: {
          log: () => {}, // Suppress console output
        },
      },
    });

    // Execute the user's code to define functions
    try {
      vm.run(code);
    } catch (err) {
      return {
        ...results,
        error: `Syntax Error: ${err.message}`,
      };
    }

    // Run each test case
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const testResult = {
        testNumber: i + 1,
        input: testCase.input,
        expected: testCase.expected_output,
        actual: null,
        passed: false,
        error: null,
      };

      try {
        // Parse input and expected output
        let input, expectedOutput;
        try {
          input = JSON.parse(testCase.input);
        } catch {
          input = testCase.input;
        }

        try {
          expectedOutput = JSON.parse(testCase.expected_output);
        } catch {
          expectedOutput = testCase.expected_output;
        }

        // Execute with test input
        let output;
        try {
          // Find the function name from the code (function name pattern)
          const functionMatch = code.match(
            /(?:function|const|let)\s+(\w+)\s*(?:=\s*\(|[=(])/
          );
          const functionName = functionMatch ? functionMatch[1] : null;

          if (!functionName) {
            throw new Error('Could not find function definition in code');
          }

          // Get the function from VM context
          const vmCode = code + `\nreturn ${functionName};`;
          const fn = vm.run(`(function() { ${vmCode} })()`);

          // Call the function with parsed input
          if (Array.isArray(input)) {
            output = fn(...input);
          } else {
            output = fn(input);
          }
        } catch (err) {
          testResult.error = err.message;
          results.testsFailed++;
          results.results.push(testResult);
          continue;
        }

        // Compare output
        const passed = JSON.stringify(output) === JSON.stringify(expectedOutput);
        testResult.passed = passed;
        testResult.actual = output;

        if (passed) {
          results.testsPassed++;
        } else {
          results.testsFailed++;
        }

        results.results.push(testResult);
      } catch (err) {
        testResult.error = err.message;
        results.testsFailed++;
        results.results.push(testResult);
      }
    }

    return results;
  } catch (err) {
    return {
      ...results,
      error: `Execution Error: ${err.message}`,
    };
  }
}

// Java executor
function executeJava(code, testCases) {
  const results = {
    testsPassed: 0,
    testsFailed: 0,
    totalTests: testCases.length,
    results: [],
    error: null,
  };

  try {
    // Create temporary directory
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'java-'));
    
    // Extract class name and wrap code if needed
    const classNameMatch = code.match(/public\s+class\s+(\w+)/);
    const className = classNameMatch ? classNameMatch[1] : 'Solution';
    
    const javaFile = path.join(tmpDir, `${className}.java`);
    
    // Wrap code if it doesn't have a class
    let wrappedCode = code;
    if (!classNameMatch) {
      wrappedCode = `public class Solution {\n${code}\n}`;
    }
    
    fs.writeFileSync(javaFile, wrappedCode);
    
    // Compile
    try {
      execSync(`javac ${javaFile}`, { timeout: 5000 });
    } catch (err) {
      return {
        ...results,
        error: `Compilation Error: ${err.message}`,
      };
    }
    
    // Run test cases
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const testResult = {
        testNumber: i + 1,
        input: testCase.input,
        expected: testCase.expected_output,
        actual: null,
        passed: false,
        error: null,
      };

      try {
        // Parse input and expected output
        let input, expectedOutput;
        try {
          input = JSON.parse(testCase.input);
        } catch {
          input = testCase.input;
        }

        try {
          expectedOutput = JSON.parse(testCase.expected_output);
        } catch {
          expectedOutput = testCase.expected_output;
        }

        // Create a test harness that calls the function
        // This is simplified - assumes a static method
        const testHarness = `
import java.util.*;

public class TestHarness {
    public static void main(String[] args) {
        try {
            String input = "${JSON.stringify(input).replace(/"/g, '\\"')}";
            Object result = Solution.solve(${Array.isArray(input) ? JSON.stringify(input) : `"${input}"`});
            System.out.println(result);
        } catch(Exception e) {
            System.err.println(e.getMessage());
        }
    }
}
        `;
        
        const testFile = path.join(tmpDir, 'TestHarness.java');
        fs.writeFileSync(testFile, testHarness);
        
        let output;
        try {
          output = execSync(`javac ${testFile} && java -cp ${tmpDir} TestHarness`, { timeout: 5000 }).toString().trim();
        } catch (err) {
          testResult.error = err.message;
          results.testsFailed++;
          results.results.push(testResult);
          continue;
        }

        // Compare output
        const passed = output === JSON.stringify(expectedOutput).replace(/"/g, '');
        testResult.passed = passed;
        testResult.actual = output;

        if (passed) {
          results.testsPassed++;
        } else {
          results.testsFailed++;
        }

        results.results.push(testResult);
      } catch (err) {
        testResult.error = err.message;
        results.testsFailed++;
        results.results.push(testResult);
      }
    }
    
    // Cleanup
    fs.rmSync(tmpDir, { recursive: true, force: true });
    
    return results;
  } catch (err) {
    return {
      ...results,
      error: `Java Execution Error: ${err.message}`,
    };
  }
}

// C executor
function executeC(code, testCases) {
  const results = {
    testsPassed: 0,
    testsFailed: 0,
    totalTests: testCases.length,
    results: [],
    error: null,
  };

  try {
    // Create temporary directory
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'c-'));
    
    const cFile = path.join(tmpDir, 'solution.c');
    const exePath = path.join(tmpDir, 'solution');
    
    fs.writeFileSync(cFile, code);
    
    // Compile
    try {
      execSync(`gcc -o ${exePath} ${cFile}`, { timeout: 5000 });
    } catch (err) {
      return {
        ...results,
        error: `Compilation Error: ${err.message}`,
      };
    }
    
    // Run test cases
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const testResult = {
        testNumber: i + 1,
        input: testCase.input,
        expected: testCase.expected_output,
        actual: null,
        passed: false,
        error: null,
      };

      try {
        let input, expectedOutput;
        try {
          input = JSON.parse(testCase.input);
        } catch {
          input = testCase.input;
        }

        try {
          expectedOutput = JSON.parse(testCase.expected_output);
        } catch {
          expectedOutput = testCase.expected_output;
        }

        let output;
        try {
          const inputStr = Array.isArray(input) ? input.join('\n') : input.toString();
          output = execSync(`echo "${inputStr}" | ${exePath}`, { timeout: 5000 }).toString().trim();
        } catch (err) {
          testResult.error = err.message;
          results.testsFailed++;
          results.results.push(testResult);
          continue;
        }

        // Compare output
        let passed = output === JSON.stringify(expectedOutput).replace(/"/g, '');
        if (!passed) {
          passed = output === expectedOutput.toString();
        }
        
        testResult.passed = passed;
        testResult.actual = output;

        if (passed) {
          results.testsPassed++;
        } else {
          results.testsFailed++;
        }

        results.results.push(testResult);
      } catch (err) {
        testResult.error = err.message;
        results.testsFailed++;
        results.results.push(testResult);
      }
    }
    
    // Cleanup
    fs.rmSync(tmpDir, { recursive: true, force: true });
    
    return results;
  } catch (err) {
    return {
      ...results,
      error: `C Execution Error: ${err.message}`,
    };
  }
}

// C++ executor
function executeCpp(code, testCases) {
  const results = {
    testsPassed: 0,
    testsFailed: 0,
    totalTests: testCases.length,
    results: [],
    error: null,
  };

  try {
    // Create temporary directory
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cpp-'));
    
    const cppFile = path.join(tmpDir, 'solution.cpp');
    const exePath = path.join(tmpDir, 'solution');
    
    fs.writeFileSync(cppFile, code);
    
    // Compile
    try {
      execSync(`g++ -o ${exePath} ${cppFile}`, { timeout: 5000 });
    } catch (err) {
      return {
        ...results,
        error: `Compilation Error: ${err.message}`,
      };
    }
    
    // Run test cases
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const testResult = {
        testNumber: i + 1,
        input: testCase.input,
        expected: testCase.expected_output,
        actual: null,
        passed: false,
        error: null,
      };

      try {
        let input, expectedOutput;
        try {
          input = JSON.parse(testCase.input);
        } catch {
          input = testCase.input;
        }

        try {
          expectedOutput = JSON.parse(testCase.expected_output);
        } catch {
          expectedOutput = testCase.expected_output;
        }

        let output;
        try {
          const inputStr = Array.isArray(input) ? input.join('\n') : input.toString();
          output = execSync(`echo "${inputStr.replace(/"/g, '\\"')}" | ${exePath}`, { timeout: 5000 }).toString().trim();
        } catch (err) {
          testResult.error = err.message;
          results.testsFailed++;
          results.results.push(testResult);
          continue;
        }

        // Compare output
        let passed = output === JSON.stringify(expectedOutput).replace(/"/g, '');
        if (!passed) {
          passed = output === expectedOutput.toString();
        }
        
        testResult.passed = passed;
        testResult.actual = output;

        if (passed) {
          results.testsPassed++;
        } else {
          results.testsFailed++;
        }

        results.results.push(testResult);
      } catch (err) {
        testResult.error = err.message;
        results.testsFailed++;
        results.results.push(testResult);
      }
    }
    
    // Cleanup
    fs.rmSync(tmpDir, { recursive: true, force: true });
    
    return results;
  } catch (err) {
    return {
      ...results,
      error: `C++ Execution Error: ${err.message}`,
    };
  }
}
