import { Controller, Get, Param } from '@nestjs/common';

@Controller('team')
export class TeamController {
    @Get('/:id/join')
    joinTeam(@Param('id') id) {
        return 'you want to join team num ' + id
    }

    @Get('/:id/leave')
    leaveTeam(@Param('id') id) {
        return 'you want to leave team num ' + id
    }

    @Get('/:id/players')
    playersByTeam(@Param('id') id) {
        return 'view players in team num ' + id
    }

    @Get('/:id/kick')
    kickPlayer(@Param('id') id) {
        return 'kick from team num ' + id
    }
}
