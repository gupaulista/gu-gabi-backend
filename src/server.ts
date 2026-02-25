import 'dotenv/config';
import app from './app';

const PORT = process.env.PORT || 3333;

app.listen(PORT as number, '0.0.0.0', () => {
    console.log(`🚀 API rodando na porta ${PORT}`);
});
