# Developer Quick Start Guide

This guide will help you get the 1SwapDash DeFi dashboard up and running quickly.

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)

### 1. Clone and Install
```bash
# Clone the repository
git clone https://github.com/ayush99336/1SwapDash.git
cd 1SwapDash

# Install dependencies
npm install
```

### 2. Get API Keys
You'll need two API keys:

#### 1inch API Key
1. Go to [1inch Developer Portal](https://portal.1inch.dev/)
2. Sign up/login and create a new project
3. Copy your API key

#### WalletConnect Project ID
1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy your Project ID

### 3. Configure Environment
Create a `.env` file in the root directory:
```env
VITE_1INCH_API_URL=https://api.1inch.dev
VITE_1INCH_API_KEY=your_1inch_api_key_here
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` - you should see the dashboard!

## 🎯 Key Development Concepts

### Project Structure
```
src/
├── components/          # React components
│   ├── AdvancedDashboard.tsx    # Main portfolio dashboard
│   ├── BalanceList.tsx          # Token balances
│   ├── SwapForm.tsx             # Token swapping
│   └── ui/                      # shadcn/ui components
├── hooks/              # Custom React hooks
├── utils/              # API utilities and helpers
├── config/             # Configuration files
└── types/              # TypeScript type definitions
```

### Adding New Features

#### 1. New API Integration
Create a utility file in `src/utils/`:
```typescript
// src/utils/newapi.ts
import axios from 'axios';

export const getNewData = async (chainId: number, address: string) => {
  try {
    const response = await axios.get(`/newapi/v1/${chainId}/${address}`);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

#### 2. Custom Hook
Create a hook in `src/hooks/`:
```typescript
// src/hooks/useNewData.ts
import { useState, useEffect } from 'react';
import { getNewData } from '../utils/newapi';

export const useNewData = (chainId: number, address: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chainId && address) {
      setLoading(true);
      getNewData(chainId, address)
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [chainId, address]);

  return { data, loading };
};
```

#### 3. New Component
Create a component in `src/components/`:
```tsx
// src/components/NewFeature.tsx
import { useAccount, useChainId } from 'wagmi';
import { useNewData } from '../hooks/useNewData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const NewFeature = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { data, loading } = useNewData(chainId, address);

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Feature</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Your component content */}
      </CardContent>
    </Card>
  );
};
```

## 🔧 Development Workflow

### Running the App
```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality
```bash
# TypeScript type checking
npm run type-check

# Linting (if configured)
npm run lint

# Format code (if configured)
npm run format
```

### Testing Wallet Integration
1. Install MetaMask browser extension
2. Connect to supported networks (Ethereum, BSC, Polygon, etc.)
3. Test wallet connection and network switching
4. Test with different wallet addresses

## 📱 Testing on Different Networks

### Supported Networks
| Network | Chain ID | RPC |
|---------|----------|-----|
| Ethereum | 1 | Built-in |
| BSC | 56 | Built-in |
| Polygon | 137 | Built-in |
| Arbitrum | 42161 | Built-in |
| Optimism | 10 | Built-in |
| Base | 8453 | Built-in |
| Linea | 59144 | Built-in |

### Testing Checklist
- [ ] Wallet connects successfully
- [ ] Network switching works
- [ ] Balances load correctly
- [ ] Portfolio data displays
- [ ] Swap quotes work
- [ ] Charts render properly
- [ ] Mobile responsive design

## 🔍 Debugging Common Issues

### API Key Issues
```bash
# Check if environment variables are loaded
console.log(import.meta.env.VITE_1INCH_API_KEY);
```

### CORS Issues
The Vite proxy handles CORS. Check `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.1inch.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Authorization', `Bearer ${process.env.VITE_1INCH_API_KEY}`);
          });
        }
      }
    }
  }
});
```

### Network Issues
Check if the network is properly configured:
```typescript
// src/config/wagmi.ts
import { createConfig } from 'wagmi';
import { mainnet, bsc, polygon /* ... */ } from 'wagmi/chains';

export const wagmiConfig = createConfig({
  chains: [mainnet, bsc, polygon /* ... */],
  // ... other config
});
```

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite node_modules/.vite
```

## 🎨 UI Development

### Using shadcn/ui Components
```bash
# Add new shadcn/ui components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
```

### Styling Guidelines
- Use Tailwind CSS classes
- Follow shadcn/ui design patterns
- Ensure responsive design
- Test on mobile devices

### Custom Components
```tsx
// Example custom component with proper typing
interface CustomComponentProps {
  title: string;
  value: number;
  loading?: boolean;
}

export const CustomComponent: React.FC<CustomComponentProps> = ({ 
  title, 
  value, 
  loading = false 
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse h-4 bg-gray-200 rounded" />
        ) : (
          <p className="text-2xl font-bold">${value.toLocaleString()}</p>
        )}
      </CardContent>
    </Card>
  );
};
```

## 📦 Building and Deployment

### Production Build
```bash
# Build for production
npm run build

# The build output will be in the 'dist' directory
```

### Environment Variables for Production
Set these in your hosting platform:
```env
VITE_1INCH_API_URL=https://api.1inch.dev
VITE_1INCH_API_KEY=your_production_api_key
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Deploy to Vercel
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Deploy to Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

## 🔄 Contributing

### Development Process
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Create Pull Request

### Code Standards
- Use TypeScript for type safety
- Follow React best practices
- Write descriptive commit messages
- Test your changes thoroughly
- Ensure responsive design

### Pull Request Checklist
- [ ] Code follows project conventions
- [ ] TypeScript compiles without errors
- [ ] Components are properly typed
- [ ] Responsive design tested
- [ ] API integrations work correctly
- [ ] Documentation updated if needed

## 📚 Additional Resources

### Documentation
- [Full Features Documentation](./docs/FEATURES.md)
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [1inch API Docs](https://docs.1inch.io/)
- [wagmi Documentation](https://wagmi.sh/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

### Tools & Extensions
- [VS Code](https://code.visualstudio.com/)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [MetaMask](https://metamask.io/)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

Happy coding! 🚀
