import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity'; // Import Organization entity

@ValidatorConstraint({ async: true })
@Injectable()
export class IsOrganizationIdValidConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(Organization) // Inject the OrganizationRepository
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async validate(organizationId: string): Promise<boolean> {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });
    return !!organization;
  }

  defaultMessage(): string {
    return 'Organization ID does not exist.';
  }
}

export function IsOrganizationIdValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsOrganizationIdValidConstraint,
    });
  };
}
