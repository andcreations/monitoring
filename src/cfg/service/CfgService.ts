import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { LogService } from '@andcreations/nestjs-common';

import { MonitoringCfgError } from '../error';
import { MonitoringCfg } from '../model';
import { MonitoringCfgSchema } from '../validation';

/** Log tag. */
const TAG = 'cfg';

/** Environment variable name with path to a configuration file. */
const CFG_FILE_ENV_VAR = 'MONITORING_CFG_FILE';

/** */
@Injectable()
export class CfgService implements OnApplicationBootstrap {
  /** Configuration. */
  private cfg: MonitoringCfg;

  /** Directory with configuration. */
  private cfgDir: string;

  /** */
  constructor(private readonly log: LogService) {
  }

  /** */
  onApplicationBootstrap(): void {
  // configuration file
    const cfgFile = this.getCfgFile();
    const cfgAbsFile = path.resolve(cfgFile);
    if (!fs.existsSync(cfgAbsFile)) {
      throw new MonitoringCfgError(
        `Configuration file ${cfgAbsFile} not found`,
      );
    }
    this.log.info('Configuration file', TAG, { file: cfgAbsFile });
    this.cfgDir = path.dirname(cfgAbsFile);

  // read configuration
    this.readCfg(cfgAbsFile);
  }

  /** */
  private readCfg(cfgFile: string): void {
  // read
    const content = fs.readFileSync(cfgFile).toString();
    const cfg = YAML.parse(content);

  // validate
    const result = MonitoringCfgSchema.validate(cfg);
    if (result.error) {
      throw new MonitoringCfgError(
        `Invalid configuration: ${result.error.message}`,
      );
    }

  // keep
    this.cfg = cfg as MonitoringCfg;
  }

  /** */
  private getCfgFile(): string {
    const cfgFile = process.env[CFG_FILE_ENV_VAR];
    if (!cfgFile) {
      throw new MonitoringCfgError(
        `No environment variable ${CFG_FILE_ENV_VAR} with configuration file`,
      );
    }
    return cfgFile;
  }

  /** */
  getCfg(): MonitoringCfg {
    return this.cfg;
  }

  /** */
  getFile(file: string): string {
    if (path.isAbsolute(file)) {
      return file;
    }
    return path.resolve(path.join(this.cfgDir, file));
  }
}