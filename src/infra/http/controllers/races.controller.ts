import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'; // Ajuste o caminho se necessário

@Controller('races')
export class RacesController {
  constructor(private prisma: PrismaService) {}

  // 1. QUALQUER ATLETA LOGADO PODE VER AS PROVAS
  @Get()
  @UseGuards(JwtAuthGuard)
  async list() {
    return await this.prisma.race.findMany({
      orderBy: {
        date: 'asc',
      },
    });
  }

  // 2. SOMENTE ADMINISTRADORES PODEM CRIAR PROVAS
  @Post()
  @UseGuards(JwtAuthGuard) // Garante que está logado
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any, // Adicionado para acessar o usuário logado
  ) {
    // Lógica de Permissão
    // O campo 'role' deve vir no payload do seu Token JWT
    const user = req.user;

    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException(
        'Apenas administradores podem criar provas.',
      );
    }

    if (!file) {
      throw new Error('A imagem da prova é obrigatória');
    }

    const imageUrl = `http://localhost:3333/uploads/${file.filename}`;

    return await this.prisma.race.create({
      data: {
        name: body.name,
        date: new Date(body.date),
        location: body.location,
        link: body.link,
        imageUrl: imageUrl,
      },
    });
  }
}
