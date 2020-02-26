import {Command, flags} from '@oclif/command'
import Axios, { AxiosInstance } from 'axios';
import { Provider } from '../models/provider.model';
import { ProviderCreatorDto, Image, Flavour, Plan, PlanCreatorDto } from '../models';

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

  async getPlans(): Promise<Plan[]> {
    const response = await this.apiClient.get('plans');
    return response.data;
  }

  async createPlan(plan: PlanCreatorDto): Promise<Plan> {
    const response = await this.apiClient.post('plans', plan);
    return response.data;
  }

  async deletePlan(planId: number): Promise<boolean> {
    const response = await this.apiClient.delete(`plans/${planId}`);
    return response.data;
  }

  async getProviderImages(providerId: number): Promise<Image[]> {
    const response = await this.apiClient.get(`providers/${providerId}/images`);
    return response.data;
  }

  async getProviderFlavours(providerId: number): Promise<Flavour[]> {
    const response = await this.apiClient.get(`providers/${providerId}/flavours`);
    return response.data;
  }

}
