#! /usr/bin/env node

const program = require("commander");
const pkg = require("./package.json");
const inquirer = require("inquirer");
const fs = require('fs');
const symbols = require('log-symbols');
const ora = require('ora');
const chalk = require('chalk');
const handlebars = require('handlebars');
const downloadGitRepo = require("download-git-repo");
const flyingRepo = 'github:brucecodezone/flying';

program
  .version(pkg.version, "-v, --version")
  .command("init <project-name>")
  .action(name => {
    if(!fs.existsSync(name)){
      inquirer.prompt([
        {
          name: "description",
          message: "请输入项目描述"
        },
        {
          name: "author",
          message: "请输入作者名称"
        }
      ]).then(answer=>{
        const spinner = ora('正在下载模板...');
        spinner.start();
        downloadGitRepo(flyingRepo, name, { clone: true }, err => {
          if(err){
            spinner.fail();
            console.log(symbols.error,chalk.red(err));            
          }else{
            spinner.succeed();
            const filename = `${name}/package.json`;
            const meta = {
              name,
              description:answer.description,
              author:answer.author,
            }
            if(fs.existsSync(filename)){
              const content = fs.readFileSync(filename).toString();
              const result = handlebars.compile(content)(meta);
              fs.writeFileSync(filename,result);
            }
            console.log(symbols.success,chalk.green('项目初始化完成'));
            
          }
        });
      });
      console.log("project name is: ", name);
    }else{
      console.log(symbols.error,chalk.red('项目已存在'));
    }
  });

program.parse(process.argv);
