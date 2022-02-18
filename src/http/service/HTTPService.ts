import { Injectable } from '@nestjs/common';
import { Axios } from 'axios';
import { toHTTPResponse, HTTPResponse } from '@andcreations/common';

import { HTTPResponseError } from '../error';

/** */
@Injectable()
export class HTTPService {
  /** Axios HTTP client. */
  private axios: Axios;

  /** */
  constructor() {
    this.axios = new Axios({});
  }

  /** */
  async get<T = any>(
    url: string,
  ): Promise<HTTPResponse<T>> {
    const config = {
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
      },
    };
    const axiosResponse = await this.axios.get<string>(url, config);
    const httpResponse = toHTTPResponse<T>(axiosResponse);
    if (httpResponse.status >= 300) {
      throw new HTTPResponseError(
        httpResponse.status,
        httpResponse.statusText,
        axiosResponse.data,
      );
    }
    return httpResponse;
  }

  /** */
  async post<B, T = any>(
    url: string,
    body: B,
  ): Promise<HTTPResponse<T>> {
    const config = {
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
      },
    };
    const axiosResponse = await this.axios.post<string>(
      url,
      JSON.stringify(body),
      config
    );
    const httpResponse = toHTTPResponse<T>(axiosResponse);
    if (httpResponse.status >= 300) {
      throw new HTTPResponseError(
        httpResponse.status,
        httpResponse.statusText,
        axiosResponse.data,
      );
    }
    return httpResponse;
  }
}