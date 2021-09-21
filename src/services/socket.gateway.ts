import { MessageBody, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { userQueries } from "src/repositoriers/user-table";

@WebSocketGateway()
export class SocketGateWay implements OnGatewayInit{
    
    constructor(
        private userQuery: userQueries,
        ) { }
        
        afterInit(server: any) {
            console.log('sockets runing')
        }
        @WebSocketServer()
        server;
        
    handleConnection(client: any, payload: any): void{
        this.server.on('connection', () => {
            console.log('socket connected')
        })
    }
    
    async notifyAdmin(@MessageBody() body: string): Promise<void>{
        try {
            const admin = await this.userQuery.findAdmin()
            this.server.emit(admin.id, body)
        } catch (error) {
            throw error
        }
    }

    async notifyAdminManager(body: string): Promise<void> {
        try {
            const admin = await this.userQuery.findAdmin()
            const managers = await this.userQuery.findManagers()
            managers.push(admin)
            managers.forEach(person => {
                this.server.emit(person.id, body)
            })
        } catch (error) {
            throw error
        }
    }

    async notifyUser(body: string, userId: any): Promise<void> {
        try {
            
        } catch (error) {
            throw error
        }
    }

}