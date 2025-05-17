# SolPort - Solana Portfolio Manager

SolPort is a web3 application designed to manage and monitor Solana-based assets. It functions as an AI-based robo-advisor, offering portfolio suggestions, adjustments, and monitoring capabilities.

![SolPort Logo](/public/sol-port.svg)

## Key Features

- **AI Investment Consultation**: Personalized portfolio recommendations based on user goals and risk tolerance
- **Portfolio Management**: Asset allocation, performance tracking, and rebalancing
- **Automation Settings**: Automatic rebalancing, automatic contributions, goal-based strategy adjustments
- **Asset Analysis**: Cryptocurrency and LST (Liquid Staking Token) analysis
- **Goal Management**: Setting and tracking financial goals
- **Multilingual Support**: Korean and English languages

## Technology Stack

- **Frontend**: TypeScript, Next.js, React, Tailwind CSS
- **Blockchain Integration**: @solana/wallet-adapter, @solana/web3.js
- **State Management**: React Context API
- **Charts and Visualization**: Recharts
- **Styling**: Tailwind CSS, shadcn/ui
- **Internationalization**: Custom language system

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher
- Solana wallet (Phantom, Solflare, etc.)

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/sol-port-app.git
cd sol-port-app
\`\`\`

2. Install dependencies:

\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:

Create a `.env.local` file in the project root and set the following variables:

\`\`\`
NEXT_PUBLIC_API_BASE_URL=http://your-backend-api-url
BACKEND_API_URL=http://your-backend-api-url
NEXT_PUBLIC_BASE_URL=http://your-frontend-url
\`\`\`

### Running the Development Server

\`\`\`bash
pnpm dev
\`\`\`

You can access the application in your browser at [http://localhost:3000](http://localhost:3000).

### Production Build

\`\`\`bash
pnpm build
pnpm start
\`\`\`

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Add environment variables in your Vercel project settings:
   - `NEXT_PUBLIC_API_BASE_URL`
   - `BACKEND_API_URL`
   - `NEXT_PUBLIC_BASE_URL` (deployed domain URL, e.g., https://sol-port.vercel.app)
3. Deploy the project.

### Resolving Image Loading Issues

If images are not displaying after deployment:

1. Verify that the `NEXT_PUBLIC_BASE_URL` environment variable is correctly set in your Vercel project settings.
2. Ensure the environment variable value does not end with a slash (`/`). (e.g., `https://example.com` is correct, `https://example.com/` is not)
3. Verify that the image loader is properly configured:

\`\`\`tsx
// Using the OptimizedImage component
import { OptimizedImage } from "@/components/ui/optimized-image"

// Displaying an image
<OptimizedImage
  src="/path/to/image.png"
  alt="Image description"
  width={100}
  height={100}
/>
\`\`\`

## Project Structure

\`\`\`
sol-port-app/
├── app/ # Next.js app router
│ ├── analysis/ # Asset analysis page
│ ├── automation/ # Automation settings page
│ ├── calendar/ # Notification center page
│ ├── chat/ # AI investment consultation page
│ ├── goals/ # Goal management page
│ ├── overview/ # Portfolio overview page
│ ├── api/ # API routes
│ ├── dashboard-layout.tsx # Dashboard layout
│ ├── globals.css # Global styles
│ ├── layout.tsx # Root layout
│ └── page.tsx # Homepage
├── components/ # React components
│ ├── consultation/ # Consultation-related components
│ ├── dashboard/ # Dashboard components
│ ├── ui/ # UI components
│ └── ...
├── context/ # React contexts
│ ├── app-state-context.tsx # App state context
│ └── language-context.tsx # Language context
├── lib/ # Utility functions
│ ├── api/ # API client
│ ├── config.ts # Configuration
│ ├── cookies.ts # Cookie utilities
│ ├── image-loader.ts # Image loader
│ └── utils.ts # Other utilities
├── public/ # Static files
│ ├── sol-port.svg # Logo
│ └── ...
├── translations/ # Multilingual translation files
│ ├── en_US.ts # English translations
│ └── ko_KR.ts # Korean translations
├── next.config.mjs # Next.js configuration
├── package.json # Package information
├── tailwind.config.ts # Tailwind CSS configuration
└── tsconfig.json # TypeScript configuration
\`\`\`

## Key Components

### 1. Dashboard Components

- `AssetSummaryCard`: Displays total asset value and daily changes
- `ReturnCard`: Shows total return and target investment amount
- `RiskScoreCard`: Displays portfolio risk score
- `AssetAllocationCard`: Shows asset allocation pie chart
- `PerformanceChartCard`: Displays portfolio performance chart
- `LstStakingCard`: Shows LST staking returns

### 2. Consultation Components

- `WalletConnection`: Wallet connection interface
- `ChatInterface`: AI investment consultation chat interface
- `PortfolioConfirmation`: Portfolio confirmation and approval
- `AutomationSettings`: Automation settings interface
- `SetupComplete`: Setup completion screen

### 3. Common Components

- `Header`: App header
- `Sidebar`: Navigation sidebar
- `LanguagePopup`: Language selection popup
- `OptimizedImage`: Optimized image component

## Environment Variables

| Variable Name            | Description                                     | Example                         |
| ------------------------ | ----------------------------------------------- | ------------------------------- |
| NEXT_PUBLIC_API_BASE_URL | API base URL accessible from the frontend       | http://api.example.com          |
| BACKEND_API_URL          | Backend-only API URL                            | http://internal-api.example.com |
| NEXT_PUBLIC_BASE_URL     | Frontend base URL (important for image loading) | https://sol-port.vercel.app     |

## Image Optimization

We've implemented a custom image loader and optimized image component to solve image loading issues:

\`\`\`tsx
// Image loader usage example
import { OptimizedImage } from "@/components/ui/optimized-image"

export function MyComponent() {
return (
<OptimizedImage
      src="/path/to/image.png"
      alt="Image description"
      width={100}
      height={100}
      fallbackText="Image not found"
    />
)
}
\`\`\`

## Contributing

1. Fork this repository.
2. Create a new branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Submit a Pull Request.
