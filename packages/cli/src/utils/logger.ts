/**
 * CLI Structured Logger
 * Using Pino for production-grade logging
 */

// @ts-ignore - ESM/CJS interop
import pinoModule from 'pino';
const pino = pinoModule.default || pinoModule;

/**
 * Log levels supported by the CLI
 */
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * Logger interface for type safety
 */
interface LogFn {
    (msg: string): void;
    (obj: object, msg?: string): void;
}

interface ILogger {
    trace: LogFn;
    debug: LogFn;
    info: LogFn;
    warn: LogFn;
    error: LogFn;
    fatal: LogFn;
    child: (bindings: object) => ILogger;
    isLevelEnabled: (level: string) => boolean;
}

/**
 * Create a configured logger instance
 */
function createLogger(): ILogger {
    const level = process.env.LOG_LEVEL || 'info';
    const isDev = process.env.NODE_ENV !== 'production';

    const options: Record<string, unknown> = {
        level,
        base: {
            app: 'ironbackend-cli'
        }
    };

    // Only add transport in dev mode with pino-pretty available
    if (isDev) {
        options.transport = {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname'
            }
        };
    }

    return pino(options) as ILogger;
}

/**
 * Singleton logger instance
 */
export const logger = createLogger();

/**
 * Create a child logger with additional context
 * @param context - Additional context to bind to logger
 * @returns Child logger instance
 */
export function createChildLogger(context: Record<string, unknown>): ILogger {
    return logger.child(context);
}

/**
 * Log levels for programmatic access
 */
export const LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const;

/**
 * Check if current log level allows logging at specified level
 * @param level - Level to check
 * @returns True if logging is enabled at this level
 */
export function isLevelEnabled(level: LogLevel): boolean {
    return logger.isLevelEnabled(level);
}

/**
 * Convenience logging functions with structured data
 */
export const log = {
    trace: (msg: string, data?: Record<string, unknown>) =>
        data ? logger.trace(data, msg) : logger.trace(msg),

    debug: (msg: string, data?: Record<string, unknown>) =>
        data ? logger.debug(data, msg) : logger.debug(msg),

    info: (msg: string, data?: Record<string, unknown>) =>
        data ? logger.info(data, msg) : logger.info(msg),

    warn: (msg: string, data?: Record<string, unknown>) =>
        data ? logger.warn(data, msg) : logger.warn(msg),

    error: (msg: string, data?: Record<string, unknown>) =>
        data ? logger.error(data, msg) : logger.error(msg),

    fatal: (msg: string, data?: Record<string, unknown>) =>
        data ? logger.fatal(data, msg) : logger.fatal(msg)
};
