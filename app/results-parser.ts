import * as fs from 'fs';
import { parse } from 'junit2json';

class TestResult {
  name: string;
  status: string;
  time: string;
  constructor(name: string, status: string, time: string) {
    this.name = name;
    this.status = status;
    this.time = time;
  }
}

export default class ResultsParser {
  filePath: string;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  executionTime: string;
  failedTestsList: string[];
  constructor(filePath: string) {
    this.filePath = filePath;
    this.passedTests = 0;
    this.failedTests = 0;
    this.skippedTests = 0;
    this.executionTime = "";
    this.failedTestsList = [];
  }
  
  async parse() {
    const file = fs.readFileSync(this.filePath, 'utf8');
    const output = await parse(file);
    const timeSeconds = Math.floor(output["time"]);
    this.executionTime = Math.floor(timeSeconds/60) + "m " + timeSeconds%60 + "s";
    const testResults = this.extract(output["testsuite"]);
    for (let testResult of testResults) {
      if (testResult.status === "failed") {
        this.failedTests++;
        this.failedTestsList.push(testResult.name);
      } else if (testResult.status === "skipped") {
        this.skippedTests++;
      } else if (testResult.status === "passed") { 
        this.passedTests++;
      }
    }
  }

  private extract(testsuites): TestResult[] {
    const testResults: TestResult[] = [];
    for (let suite of testsuites) {
      for (let test of suite["testcase"]){
        const testName = test["name"];
        const testTime = test["time"];
        const testStatus = this.getTestStatus(test);
        testResults.push(new TestResult(testName, testStatus, testTime));
      }
    }
    return testResults;
  }

  private getTestStatus(testJson){
    if(testJson["failure"] !== undefined){
      return "failed";
    }
    else if(testJson["skipped"] !== undefined){
      return "skipped";
    }
    else{
      return "passed";
    }
  }
}