import * as fs from 'fs'
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { LogService } from '@andcreations/nestjs-common';

import { CfgService } from '../../cfg/service';
import { PropertiesError } from 'property/error';

/** Log tag. */
const TAG = 'properties';

/** */
@Injectable()
export class PropertyService implements OnApplicationBootstrap {
  /** Path to the file with properties. */
  private propertiesFile: string;

  /** Properties. */
  private properties: { [key: string]: any } = {};

  /** */
  constructor(
    private readonly log: LogService,
    private readonly cfgService: CfgService) {
  }

  /** */
  async onApplicationBootstrap(): Promise<void> {
  // properties file
    const propertiesCfg = this.cfgService.getCfg().properties;
    this.propertiesFile = this.cfgService.getFile(propertiesCfg.file);
    this.log.info('Properties files', TAG, { file: this.propertiesFile });

  // load
    await this.load();
  }

  /** */
  async get<T>(key: string, defaultValue?: T): Promise<T | undefined> {
    const value = this.properties[key] as T;
    return value != null ? value : defaultValue;
  }

  /** */
  set<T>(key: string, value: T): Promise<void> {
    this.properties[key] = value;
    return this.save();
  }

  /** */
  private async save(): Promise<void> {
    const content = JSON.stringify(this.properties);
    fs.writeFileSync(this.propertiesFile, content);
  }

  /** */
  private async load(): Promise<void> {
    if (!fs.existsSync(this.propertiesFile)) {
      return;
    }

  // read
    const content = fs.readFileSync(this.propertiesFile).toString();
    if (!content.length) {
      return;
    }

  // parse
    this.properties = JSON.parse(content);
    if (typeof this.properties !== 'object') {
      throw new PropertiesError(`Invalid properties in ${this.propertiesFile}`);
    }
  }
}