import mqtt, { MqttClient } from "mqtt";

export class MQTT {
    #CONNECTION_STR: string = "/at/htl-vil/arsicn/chat/";
    #client?: MqttClient;
    #onMessageCallback: (topic: string, message: Buffer) => {};

    constructor(onMessageCallback: (topic: string, message: Buffer) => {}) {
        mqtt.connectAsync("mqtt://broker.hivemq.com", {
            port: 1883
        })
        .then((client) => this.#client = client)
        .catch((err) => {
            throw new Error(err);
        });  
        this.#onMessageCallback = onMessageCallback;
    }

    subscribe(suffix: string) {
        this.#client?.subscribe(this.#CONNECTION_STR +suffix);
        this.#client?.subscribe(this.#CONNECTION_STR +"global/#");
        this.#client?.on("message", this.#onMessageCallback);
    }

    publish(suffix: string, message: string) {
        this.#client?.publish(this.#CONNECTION_STR +suffix, message, {
            qos: 0,
            retain: true
        })
    }
}