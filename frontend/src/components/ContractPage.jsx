<<<<<<< HEAD
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, Check } from 'lucide-react'
import logoImage from '../assets/investbet-logo.jpg'

const ContractPage = ({ onAccept }) => {
  const [agreed, setAgreed] = useState(false)

  const handleAccept = () => {
    if (agreed) {
      onAccept()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg overflow-hidden">
            <img 
              src={logoImage} 
              alt="InvestPro Capital Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">InvestPro Capital</h1>
          <p className="text-blue-200">Termos de Uso e Contrato de Investimento</p>
        </div>

        {/* Card do Contrato */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-2xl font-bold">Contrato de Investimento</CardTitle>
            </div>
            <CardDescription className="text-center">
              Leia atentamente os termos antes de prosseguir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 w-full border rounded-md p-4 mb-6">
              <div className="space-y-4 text-sm text-gray-700">
                <h3 className="font-bold text-lg text-gray-900">TERMOS DE USO - INVESTPRO CAPITAL</h3>
                
                <div>
                  <h4 className="font-semibold mb-2">1. ACEITE DOS TERMOS</h4>
                  <p>
                    Ao utilizar a plataforma InvestPro Capital, você concorda em cumprir estes Termos de Uso. 
                    Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. DESCRIÇÃO DOS SERVIÇOS</h4>
                  <p>
                    A InvestPro Capital é uma plataforma de investimentos que oferece oportunidades de 
                    investimento em diversos produtos financeiros. Nossos serviços incluem:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>Gestão de carteira de investimentos</li>
                    <li>Análise de mercado e relatórios</li>
                    <li>Suporte ao investidor</li>
                    <li>Plataforma de acompanhamento de rendimentos</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">3. RISCOS DE INVESTIMENTO</h4>
                  <p>
                    <strong>IMPORTANTE:</strong> Todo investimento envolve riscos. O desempenho passado não 
                    garante resultados futuros. Você pode perder parte ou todo o capital investido. 
                    É fundamental que você:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>Invista apenas o que pode se permitir perder</li>
                    <li>Diversifique seus investimentos</li>
                    <li>Busque orientação profissional quando necessário</li>
                    <li>Mantenha-se informado sobre os mercados</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">4. RESPONSABILIDADES DO USUÁRIO</h4>
                  <p>Você se compromete a:</p>
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>Fornecer informações verdadeiras e atualizadas</li>
                    <li>Manter a confidencialidade de suas credenciais</li>
                    <li>Usar a plataforma de forma responsável</li>
                    <li>Cumprir todas as leis aplicáveis</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">5. PRIVACIDADE E SEGURANÇA</h4>
                  <p>
                    Protegemos suas informações pessoais de acordo com nossa Política de Privacidade. 
                    Utilizamos tecnologias de segurança avançadas para proteger seus dados e investimentos.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">6. LIMITAÇÃO DE RESPONSABILIDADE</h4>
                  <p>
                    A InvestPro Capital não será responsável por perdas decorrentes de flutuações de mercado, 
                    decisões de investimento do usuário ou fatores externos fora de nosso controle.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">7. MODIFICAÇÕES</h4>
                  <p>
                    Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                    As alterações serão comunicadas através da plataforma.
                  </p>
                </div>

                <div className="border-t pt-4 mt-6">
                  <p className="text-xs text-gray-500">
                    Última atualização: Janeiro de 2025<br/>
                    InvestPro Capital - Todos os direitos reservados
                  </p>
                </div>
              </div>
            </ScrollArea>

            {/* Checkbox de concordância */}
            <div className="flex items-center space-x-2 mb-6">
              <Checkbox 
                id="agree" 
                checked={agreed}
                onCheckedChange={setAgreed}
              />
              <label 
                htmlFor="agree" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Li e concordo com os termos de uso e contrato de investimento
              </label>
            </div>

            {/* Botão de aceitar */}
            <Button 
              onClick={handleAccept}
              disabled={!agreed}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Check size={20} />
                Aceitar e Continuar
              </div>
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Ao aceitar, você confirma que leu, entendeu e concorda com todos os termos apresentados.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ContractPage
=======
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
>>>>>>> 68048ee0f45367395ea451b64aeb27cb26493f1f

