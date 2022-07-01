import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import DialogflowService from 'src/services/dialogflow.service';
import TwilioService from 'src/services/twilio.service';
import {
    ConversationWebhookBody,
    ScopedConversationBody,
    WebhookStatusResponse,
} from './conversations.entities';

@Controller('/conversations')
export default class ConversationsController {
    constructor(
        private readonly twilioService: TwilioService,
        private readonly dialogflowService: DialogflowService,
    ) {}

    @Post('events')
    async eventHandler(
        @Body() conversationWebhookBody: ConversationWebhookBody,
    ): Promise<WebhookStatusResponse> {
        await this.twilioService.createConversationWebhook(
            conversationWebhookBody.ConversationSid,
        );
        return { status: 'ok' };
    }

    @Post('/:conversationId/events')
    async conversationHandler(
        @Body() scopedConversationBody: ScopedConversationBody,
    ): Promise<WebhookStatusResponse> {
        const dialogFlowResponse = await this.dialogflowService.getResponse(
            scopedConversationBody.Body,
        );

        await this.twilioService.sendMessage(
            scopedConversationBody.ConversationSid,
            dialogFlowResponse,
        );

        return { status: 'ok' };
    }
}
