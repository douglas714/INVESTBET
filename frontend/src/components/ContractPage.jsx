import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Check } from 'lucide-react';
import logoImage from '../assets/investbet-logo.jpg';

const ContractPage = ({ onAccept }) => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleAccept = () => {
    if (agreed && typeof onAccept === 'function') {
      onAccept();
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <img src={logoImage} alt="Logo" className="w-16 h-16 mx-auto mb-4 rounded-full" />
          <CardTitle className="text-2xl">Termos de Uso e Contrato</CardTitle>
          <CardDescription>Leia atentamente antes de prosseguir</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-72 w-full border rounded-md p-4 mb-6">
            <h3 className="font-bold">1. ACEITE DOS TERMOS</h3>
            <p className="text-sm text-gray-600 mb-4">
              Ao utilizar a plataforma, você concorda em cumprir estes Termos de Uso. Se você não concorda, não deve usar nossos serviços.
            </p>
            <h3 className="font-bold">2. RISCOS DE INVESTIMENTO</h3>
            <p className="text-sm text-gray-600 mb-4">
              Todo investimento envolve riscos. O desempenho passado não garante resultados futuros.
            </p>
            <h3 className="font-bold">3. RESPONSABILIDADES DO USUÁRIO</h3>
            <p className="text-sm text-gray-600 mb-4">
              Você se compromete a fornecer informações verdadeiras, manter a confidencialidade de sua conta e não utilizar a plataforma para atividades ilegais.
            </p>
            <h3 className="font-bold">4. POLÍTICA DE PRIVACIDADE</h3>
            <p className="text-sm text-gray-600 mb-4">
              Seus dados pessoais são protegidos conforme nossa Política de Privacidade. Não compartilhamos informações com terceiros sem seu consentimento.
            </p>
            <h3 className="font-bold">5. LIMITAÇÃO DE RESPONSABILIDADE</h3>
            <p className="text-sm text-gray-600 mb-4">
              A InvestPro Capital não se responsabiliza por perdas decorrentes de decisões de investimento tomadas pelo usuário.
            </p>
            <h3 className="font-bold">6. MODIFICAÇÕES DOS TERMOS</h3>
            <p className="text-sm text-gray-600 mb-4">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação.
            </p>
            <h3 className="font-bold">7. RESCISÃO</h3>
            <p className="text-sm text-gray-600 mb-4">
              Podemos encerrar ou suspender sua conta a qualquer momento, por qualquer motivo, sem aviso prévio.
            </p>
            <h3 className="font-bold">8. LEI APLICÁVEL</h3>
            <p className="text-sm text-gray-600">
              Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos tribunais competentes do Brasil.
            </p>
          </ScrollArea>
          
          <div className="flex items-center space-x-2 mb-6">
            <Checkbox id="agreed" checked={agreed} onCheckedChange={setAgreed} />
            <label htmlFor="agreed" className="text-sm font-medium">
              Li e concordo com os termos do contrato de investimento.
            </label>
          </div>

          <div>
            <Button onClick={handleAccept} disabled={!agreed} className="w-full">
              <Check className="mr-2 h-4 w-4" />
              Aceitar e Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractPage;
