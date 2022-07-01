import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import ConversationsController from './controllers/conversations/conversations.controller';
import DialogflowService from './services/dialogflow.service';
import TwilioService from './services/twilio.service';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [ConversationsController],
    providers: [TwilioService, DialogflowService],
})
export class AppModule {}
