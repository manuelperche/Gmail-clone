import type { IEmailRepository } from "../interfaces/email-repository.interface";
import type { IEmailDataSource } from "../interfaces/email-datasource.interface";
import type { ITimeService } from "../interfaces/time-service.interface";
import { EmailUseCase } from "../usecases/email.usecase";
import { EmailRepository } from "../../data/repositories/email.repository";
import { EmailDataSource } from "../../data/datasources/email.datasource";
import { TimeService } from "../services/time.service";

export class DIContainer {
  private static instance: DIContainer;
  private timeService?: ITimeService;
  private dataSource?: IEmailDataSource;
  private repository?: IEmailRepository;
  private useCase?: EmailUseCase;

  private constructor() {}

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  getTimeService(): ITimeService {
    if (!this.timeService) {
      this.timeService = new TimeService();
    }
    return this.timeService;
  }

  getEmailDataSource(): IEmailDataSource {
    if (!this.dataSource) {
      this.dataSource = new EmailDataSource(this.getTimeService());
    }
    return this.dataSource;
  }

  getEmailRepository(): IEmailRepository {
    if (!this.repository) {
      this.repository = new EmailRepository(this.getEmailDataSource());
    }
    return this.repository;
  }

  getEmailUseCase(): EmailUseCase {
    if (!this.useCase) {
      this.useCase = new EmailUseCase(this.getEmailRepository());
    }
    return this.useCase;
  }

  // For testing - allows injection of mock dependencies
  setTimeService(timeService: ITimeService): void {
    this.timeService = timeService;
  }

  setEmailDataSource(dataSource: IEmailDataSource): void {
    this.dataSource = dataSource;
  }

  setEmailRepository(repository: IEmailRepository): void {
    this.repository = repository;
  }

  // Reset all dependencies (useful for testing)
  reset(): void {
    this.timeService = undefined;
    this.dataSource = undefined;
    this.repository = undefined;
    this.useCase = undefined;
  }
}