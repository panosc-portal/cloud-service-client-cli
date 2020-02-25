import {Command, flags} from '@oclif/command'
import Axios, { AxiosInstance } from 'axios';
import { Provider } from '../models/provider.model';
import { ProviderCreatorDto } from '../models';

export abstract class BaseCommand extends Command {

  static baseFlags = {
    help: flags.help({char: 'h'}),
    url: flags.string({char: 'u', description: 'URL of the cloud service', default: 'http://localhost:3001'}),
  }

  private _apiClient: AxiosInstance;
  private _cloudServiceUrl: string;

  protected set cloudServiceUrl(value: string) {
    this._cloudServiceUrl = value;
  }

  protected get apiClient(): AxiosInstance {
    if (this._apiClient == null) {
      this._apiClient = Axios.create({
        baseURL: `${this._cloudServiceUrl}/api/v1`,
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return this._apiClient;
  }

  async getProviders(): Promise<Provider[]> {
    const response = await this.apiClient.get('providers');
    return response.data;
  }

  async createProvider(provider: ProviderCreatorDto): Promise<Provider> {
    const response = await this.apiClient.post('providers', provider);
    return response.data;
  }

  async deleteProvider(providerId: number): Promise<boolean> {
    const response = await this.apiClient.delete(`providers/${providerId}`);
    return response.data;
  }



}
