import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentEnums } from 'src/enums/environment.enums';
import { Twilio } from 'twilio';

@Injectable()
export default class TwilioService {
    private readonly client: Twilio;
    private readonly conversationsServiceId: string;

    constructor(private configService: ConfigService) {
        this.client = new Twilio(
            this.configService.get(EnvironmentEnums.SERVICE_TWILIO_KEY_SID),
            this.configService.get(EnvironmentEnums.SERVICE_TWILIO_KEY_SECRET),
            {
                accountSid: this.configService.get(
                    EnvironmentEnums.SERVICE_TWILIO_ACCOUNT_SID,
                ),
            },
        );
        this.conversationsServiceId = this.configService.get(
            EnvironmentEnums.SERVICE_TWILIO_CONVERSATION_SID,
        );
    }

    /**
     * Creates a scoped conversation webhook
     * @param conversationId
     * @returns webhook sid
     */
    public createConversationWebhook = async (
        conversationId: string,
    ): Promise<string> => {
        const conversationsUrl = `${this.configService.get(
            EnvironmentEnums.APPLICATION_ENDPOINT,
        )}/conversations/${conversationId}/events`;

        const createRequest = await this.client.conversations
            .conversations(conversationId)
            .webhooks.create({
                configuration: {
                    method: 'POST',
                    filters: ['onMessageAdded'],
                    url: conversationsUrl,
                    replayAfter: 0,
                },
                target: 'webhook',
            });

        return createRequest.sid;
    };

    /**
     * Creates a message in the conversations service
     * @param conversationId
     * @param message
     * @returns message sid
     */
    public sendMessage = async (conversationId: string, message: string) => {
        const messageResponse = await this.client.conversations
            .services(this.conversationsServiceId)
            .conversations(conversationId)
            .messages.create({
                body: message,
            });

        return messageResponse.sid;
    };

    public getClient = (): Twilio => this.client;
}
