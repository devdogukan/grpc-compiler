import * as os from 'os';

export class PlatformHelper {
    static getPlatform(): string {
        const platform = os.platform();
        if (platform === 'win32') { return 'Windows'; }
        if (platform === 'darwin') { return 'macOS'; }
        if (platform === 'linux') { return 'Linux'; }
        return 'Unknown';
    }
}