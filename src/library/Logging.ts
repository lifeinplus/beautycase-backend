import chalk from "chalk";
import fs from "fs";
import path from "path";

enum Method {
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Delete = "DELETE",
}

const fileLog = async (message: string) => {
    const dirPath = path.join("logs");
    const filePath = path.join(dirPath, "main.log");

    try {
        if (!fs.existsSync(dirPath)) {
            await fs.promises.mkdir(dirPath);
        }

        await fs.promises.appendFile(filePath, message + "\n");
    } catch (error) {
        console.error(error);
    }
};

const chalkMethod = (method: string) => {
    switch (method) {
        case Method.Get:
            return chalk.greenBright(method);
        case Method.Post:
            return chalk.yellow(method);
        case Method.Put:
            return chalk.blue(method);
        case Method.Delete:
            return chalk.red(method);
        default:
            return method;
    }
};

class Logging {
    public static log = (value: any) => this.info(value);

    public static info = (message: any) => {
        const time = `[${new Date().toLocaleString()}] [INFO]`;
        const timeChalk = chalk.blue(time);
        console.log(`${timeChalk} ${message}`);
        fileLog(`${time} ${message}`);
    };

    public static infoIn = (message: string, method: string) => {
        const time = `[${new Date().toLocaleString()}] [INFO]`;
        const timeChalk = chalk.blue(time);

        const direction = "Incoming <-";
        const directionChalk = chalk.bgBlue(direction);

        const methodChalk = chalkMethod(method);
        const messageChalk = message.replace("{method}", methodChalk || method);

        console.log(`${timeChalk} ${directionChalk} ${messageChalk}`);
        fileLog(`${time} ${direction} ${message}`);
    };

    public static infoOut = (message: string, method: string) => {
        const time = `[${new Date().toLocaleString()}] [INFO]`;
        const timeChalk = chalk.blue(time);

        const direction = "Outgoing ->";
        const directionChalk = chalk.bgBlueBright(direction);

        const methodChalk = chalkMethod(method);
        const messageChalk = message.replace("{method}", methodChalk);

        console.log(`${timeChalk} ${directionChalk} ${messageChalk}`);
        fileLog(`${time} ${direction} ${message}`);
    };

    public static warn = (message: any) => {
        const time = `[${new Date().toLocaleString()}] [WARN]`;
        const timeChalk = chalk.yellow(time);
        console.log(`${timeChalk} ${message}`);
        fileLog(`${time} ${message}`);
    };

    public static error = (message: any) => {
        const time = `[${new Date().toLocaleString()}] [ERROR]`;
        const timeChalk = chalk.red(time);
        console.log(`${timeChalk} ${message}`);
        fileLog(`${time} ${message}`);
    };
}

export default Logging;
