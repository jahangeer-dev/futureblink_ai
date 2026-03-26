import chalk from 'chalk';

class Logger {
    private static instance: Logger;

    private constructor() {}

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private formatMessage(service: string, emoji: string, msg: string): string {
        return `${emoji} [${service.toUpperCase()}] ${msg}`;
    }

    public info(service: string, msg: string): void {
        console.log(chalk.blueBright(this.formatMessage(service, '🚀', msg)));
    }

    public success(service: string, msg: string): void {
        console.log(chalk.greenBright(this.formatMessage(service, '✅', msg)));
    }

    public error(service: string, msg: string): void {
        console.error(chalk.redBright(this.formatMessage(service, '❌', msg)));
    }

    public warn(service: string, msg: string): void {
        console.warn(chalk.yellowBright(this.formatMessage(service, '⚠️', msg)));
    }
}

export const logger = Logger.getInstance();
