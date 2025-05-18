'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Check, RefreshCw, Info } from 'lucide-react';
import { getAssetAnalysis } from '@/lib/api/portfolio';
import { useLanguage } from '@/context/language-context';
import { useAppState } from '@/context/app-state-context';

interface PortfolioConfirmationProps {
  result: any;
  onConfirm: () => void;
  onRetry: () => void;
  walletAddress: string;
}

export function PortfolioConfirmation({
  result,
  onConfirm,
  onRetry,
  walletAddress,
}: PortfolioConfirmationProps) {
  // State to track which improvement suggestion is selected
  const [selectedImprovement, setSelectedImprovement] = useState<string | null>(
    null
  );
  const [assetAnalysis, setAssetAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { isMockPortfolio } = useAppState();

  // Extract data from the result
  const modelInput = result?.model_input || {};
  const modelOutput = result?.model_output || {};

  // Fetch asset analysis data
  useEffect(() => {
    async function fetchAssetAnalysis() {
      if (walletAddress) {
        setLoading(true);
        try {
          const data = await getAssetAnalysis(walletAddress);
          setAssetAnalysis(data);
        } catch (error) {
          console.error('Failed to fetch asset analysis:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchAssetAnalysis();
  }, [walletAddress]);

  // Format weights for pie chart
  const weights = modelOutput.weights || {};
  const pieData = Object.entries(weights).map(([name, value]) => ({
    name,
    value: Number(value) * 100,
  }));

  // Colors for pie chart
  const COLORS = ['#8A63D2', '#9D7FE0', '#B29BEE', '#C7B7F7', '#DCD3FF'];

  // Improvement suggestions from the API or fallback to result data
  const improvements = [
    {
      id: 'increase_contribution',
      title: t('portfolio.increase').replace(
        '{amount}',
        String(modelInput.periodic_contributions_amount || 150)
      ),
      description: `${t('portfolio.fundedRatio')}: ${
        assetAnalysis?.total_profit
          ? Math.round(assetAnalysis.total_profit + 8)
          : 108
      }% / ${t('portfolio.successProbability')}: ${
        modelOutput.success_probability
          ? Math.round(modelOutput.success_probability * 100)
          : 92
      }%`,
    },
    {
      id: 'extend_period',
      title: t('portfolio.extend'),
      description: `${t('portfolio.fundedRatio')}: ${
        assetAnalysis?.total_profit
          ? Math.round(assetAnalysis.total_profit + 12)
          : 112
      }% / ${t('portfolio.successProbability')}: ${
        modelOutput.success_probability
          ? Math.round((modelOutput.success_probability + 0.03) * 100)
          : 95
      }%`,
    },
  ];

  // Handle improvement selection
  const handleImprovementSelect = (id: string) => {
    setSelectedImprovement(id);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-[#161a2c] rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">{t('portfolio.title')}</h2>

      {isMockPortfolio && (
        <div className="bg-blue-900/30 border border-blue-500 text-blue-100 px-4 py-2 rounded-md mb-4 flex items-center">
          <Info className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{t('portfolio.mockNotice')}</span>
        </div>
      )}

      <p className="text-solport-textSecondary mb-6">
        {modelOutput.portfolio_name ? (
          <span className="font-medium text-lg">
            {modelOutput.portfolio_name}
          </span>
        ) : (
          t('portfolio.description').replace(
            '{simulations}',
            String(modelInput.initial_investment || 10)
          )
        )}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1a1e30] rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">
            {t('portfolio.composition')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                  strokeWidth={0}
                  animationBegin={0}
                  animationDuration={1000}
                  isAnimationActive={true}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    color: 'white',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center">
                <div
                  className="w-4 h-4 mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span>
                  {entry.name} ({entry.value.toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1a1e30] rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">{t('portfolio.metrics')}</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-solport-textSecondary">
                {t('portfolio.expectedReturn')}
              </span>
              <span className="text-lg font-medium">
                {assetAnalysis?.average_apy
                  ? assetAnalysis.average_apy.toFixed(1)
                  : (modelOutput.expected_return * 100).toFixed(1)}
                %
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-solport-textSecondary">
                {t('portfolio.expectedVolatility')}
              </span>
              <span className="text-lg font-medium">
                {(modelOutput.expected_volatility * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-solport-textSecondary">
                {t('portfolio.fundedRatio')}
              </span>
              <span className="text-lg font-medium text-red-500">
                {assetAnalysis?.total_profit ||
                  (modelOutput.success_probability * 100).toFixed(0)}
                %
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-solport-textSecondary">
                {t('portfolio.successProbability')}
              </span>
              <span className="text-lg font-medium text-yellow-500">
                {(modelOutput.success_probability * 100).toFixed(0)}%
              </span>
            </div>
            {modelInput.goal_date && (
              <div className="flex justify-between items-center">
                <span className="text-solport-textSecondary">
                  {t('portfolio.targetDate')}
                </span>
                <span className="text-lg font-medium">
                  {formatDate(modelInput.goal_date)}
                </span>
              </div>
            )}
            {modelInput.investment_purpose && (
              <div className="flex justify-between items-center">
                <span className="text-solport-textSecondary">
                  {t('portfolio.purpose')}
                </span>
                <span className="text-lg font-medium capitalize">
                  {modelInput.investment_purpose.replace(/_/g, ' ')}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-[#242b42] rounded-lg">
            <p className="text-sm">
              {t('portfolio.analysis')
                .replace(
                  '{percent}',
                  (modelOutput.success_probability * 100).toFixed(0)
                )
                .replace(
                  '{probability}',
                  (modelOutput.success_probability * 100).toFixed(0)
                )}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1e30] rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium mb-4">
          {t('portfolio.improvements')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {improvements.map((improvement) => (
            <button
              key={improvement.id}
              className={`text-left bg-[#242b42] rounded-lg p-4 transition-all ${
                selectedImprovement === improvement.id
                  ? 'border-2 border-solport-accent'
                  : 'border border-transparent hover:border-solport-accent/50'
              }`}
              onClick={() => handleImprovementSelect(improvement.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{improvement.title}</h4>
                {selectedImprovement === improvement.id && (
                  <div className="w-5 h-5 rounded-full bg-solport-accent flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-sm text-solport-textSecondary">
                {improvement.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-solport-textSecondary">
          {`Portfolio #${modelOutput.portfolio_id}`}
        </div>

        {modelOutput.creation_date && (
          <div className="text-sm text-solport-textSecondary">
            Created: {formatDate(modelOutput.creation_date)}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          className="border-solport-accent text-solport-accent hover:bg-solport-accent hover:text-white cursor-not-allowed opacity-70"
          onClick={(e) => {
            e.preventDefault();
            // This button should appear functional but not do anything
            console.log(
              'Restart consultation clicked - functionality not yet available'
            );
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {t('portfolio.restart')}
        </Button>
        <Button
          className="bg-solport-accent hover:bg-solport-accent2"
          onClick={onConfirm}
        >
          <Check className="mr-2 h-4 w-4" />
          {t('portfolio.next')}
        </Button>
      </div>
    </div>
  );
}
