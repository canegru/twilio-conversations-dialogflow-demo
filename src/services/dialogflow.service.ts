import dialogflow, { SessionsClient } from '@google-cloud/dialogflow';
import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentEnums } from 'src/enums/environment.enums';
import { v4 as uuid } from 'uuid';

@Injectable()
export default class DialogflowService {
    private readonly sessionClient: SessionsClient;
    private readonly sessionPath: string;

    constructor(private configService: ConfigService) {
        const sessionId = uuid();
        const dialogflowProjectId = this.configService.get(
            EnvironmentEnums.GCP_DF_PROJECT_ID,
        );
        const dialogFlowPrivateKey = this.configService.get(
            EnvironmentEnums.GCP_DF_PRIVATE_KEY,
        );
        const dialogFlowClientEmail = this.configService.get(
            EnvironmentEnums.GCP_DF_CLIENT_EMAIL,
        );

        this.sessionClient = new dialogflow.SessionsClient({
            credentials: {
                private_key: dialogFlowPrivateKey,
                client_email: dialogFlowClientEmail,
            },
        });

        this.sessionPath = this.sessionClient.projectAgentSessionPath(
            dialogflowProjectId,
            sessionId,
        );
    }

    public getResponse = async (userMessage: string) => {
        const request: google.cloud.dialogflow.v2.IDetectIntentRequest = {
            session: this.sessionPath,
            queryInput: {
                text: {
                    text: userMessage,
                    languageCode: 'en-US',
                },
            },
        };
        const [response] = await this.sessionClient.detectIntent(request);
        const textResponse =
            response.queryResult?.fulfillmentText ||
            'Can you please ask me something else?';
        return textResponse;
    };
}
