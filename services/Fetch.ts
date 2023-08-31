import axios, { AxiosRequestConfig } from "axios";

import getConfig from "next/config";
import { RawCurrentUser } from "./types";
const { publicRuntimeConfig } = getConfig();

const baseUrl = `${publicRuntimeConfig.NEXT_PUBLIC_API_URL}`;

const api = axios.create({
  responseType: "json",
  timeout: 30 * 60 * 1000,
});

class FetchInstance {
  token_type = "Bearer";
  access_token: string = "";
  client_key: string = "";
  user: RawCurrentUser | undefined = undefined;
  getUrl = (url: string) => {
    return baseUrl + url;
  };
  getConfigWithToken = async (
    config: AxiosRequestConfig = {}
  ): Promise<AxiosRequestConfig> => {
    let headers = config.headers || {};
    if (!this.client_key) {
      // const me = sessionStorage?.getItem("me");
      const accessToken = sessionStorage?.getItem("token");
      const client_key = localStorage.getItem("client_key");
      this.client_key = client_key || "";
      this.access_token = accessToken || "";
      // this.client_key =  "";
      // this.access_token =  "";
    }
    if (this.access_token) {
      headers = {
        Authorization: `${this.token_type} ${this.access_token}`,
        ...headers,
      };
    }
    headers.ClientKey = this.client_key;
    return {
      ...config,
      headers,
    };
  };

  get = async <ResponseType>(url: string, config?: AxiosRequestConfig) => {
    return api.get<ResponseType>(
      this.getUrl(url),
      await this.getConfigWithToken(config)
    );
  };

  delete = async <ResponseType>(url: string, config?: AxiosRequestConfig) => {
    return api.delete<ResponseType>(
      this.getUrl(url),
      await this.getConfigWithToken(config)
    );
  };

  post = async <ResponseType>(
    url: string,
    data: Record<string, any> = {},
    config?: AxiosRequestConfig
  ) => {
    return api.post<ResponseType>(
      this.getUrl(url),
      data,
      await this.getConfigWithToken(config)
    );
  };

  put = async <ResponseType>(
    url: string,
    data: Record<string, any> = {},
    config?: AxiosRequestConfig
  ) => {
    return api.put<ResponseType>(
      this.getUrl(url),
      data,
      await this.getConfigWithToken(config)
    );
  };
}

const Fetch = new FetchInstance();

export default Fetch;
