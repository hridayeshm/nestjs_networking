import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OtpService } from './otp.service';
import { Otp } from './entities/otp.entity';
import { CreateOtpInput } from './dto/create-otp.input';
import { UpdateOtpInput } from './dto/update-otp.input';

@Resolver(() => Otp)
export class OtpResolver {
  constructor(private readonly otpService: OtpService) {}

  @Mutation(() => Otp)
  createOtp(@Args('createOtpInput') createOtpInput: CreateOtpInput) {
    return this.otpService.create(createOtpInput);
  }

  @Query(() => [Otp], { name: 'otp' })
  findAll() {
    return this.otpService.findAll();
  }

  @Query(() => Otp, { name: 'otp' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.otpService.findOne(id);
  }

  @Mutation(() => Otp)
  updateOtp(@Args('updateOtpInput') updateOtpInput: UpdateOtpInput) {
    return this.otpService.update(updateOtpInput.id, updateOtpInput);
  }

  @Mutation(() => Otp)
  removeOtp(@Args('id', { type: () => Int }) id: number) {
    return this.otpService.remove(id);
  }
}
