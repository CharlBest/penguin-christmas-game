import { Application } from 'express';
import * as http from 'http';
// import { SwaggerUI } from './SwaggerUI';
import { Database } from './database';

export class Server {

    static normalizePort(port: string | number): number | string | boolean {
        const parsedPort: number = (typeof port === 'string') ? parseInt(port, 10) : port;
        if (isNaN(parsedPort)) { // named pipe
            return port;
        }
        if (parsedPort >= 0) { // port number
            return parsedPort;
        }
        return false;
    }

    constructor(public httpServer: http.Server) { }

    init(app: Application): void {
        this.httpServer.on('listening', () => {
            console.log(`Aloha, your app is ready on ${app.get('host') || 'localhost'}:${app.get('port')}`);
        });

        // this.httpServer.on('error', (error) => { });

        this.httpServer.on('close', () => {
            Database.clearDriver();
        });

        // process.on('SIGINT', () => { });
        // process.on('SIGHUP', () => { });
        // process.on('SIGQUIT', () => { });
        // process.on('exit', () => { });

        process.on('SIGTERM', () => {
            Database.clearDriver();
            process.exit(0);
        });

        process.on('uncaughtException', (event) => {
            console.log('Internal: Uncaught exception\n');
            console.log(event.stack + '\n');
            process.exit(1);
        });

        process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
            console.log('Internal: UnhandledPromiseRejectionWarning\n');
            console.log(reason + '\n');
            console.log(reason.stack || reason.messsage || reason);

            process.exit(1);
        });
    }
}
