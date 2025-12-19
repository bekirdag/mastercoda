
import React, { useState, useEffect } from 'react';
import { Invoice, PaymentMethod } from '../types';
import { MOCK_INVOICES, MOCK_PAYMENT_METHODS } from '../constants';
import Button from './Button';
import Badge from './Badge';
// Added missing icon imports SparklesIcon, AlertTriangleIcon, XIcon, and GlobeIcon
import { 
  ShieldIcon, 
  CreditCardIcon, 
  DownloadIcon, 
  PlusIcon, 
  TrashIcon, 
  AlertCircleIcon, 
  ActivityIcon, 
  ZapIcon, 
  HardDriveIcon,
  RotateCwIcon,
  LockIcon,
  ChevronRightIcon,
  SparklesIcon,
  AlertTriangleIcon,
  XIcon,
  GlobeIcon
} from './Icons';

const BillingSettings: React.FC = () => {
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [paymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Meter states for animation
  const [meters, setMeters] = useState({ agents: 0, storage: 0, api: 0 });

  useEffect(() => {
    // Animate meters on load
    const timer = setTimeout(() => {
      setMeters({ agents: 50, storage: 24, api: 76 });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDeleteAccount = () => {
    if (deleteConfirmText === 'DELETE') {
       alert("Account deletion initiated. Redirecting...");
    }
  };

  const handleAddPaymentMethod = () => {
    alert("Stripe Elements integration would launch here.");
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-[1000px] mx-auto space-y-10 animate-in fade-in duration-500">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
            <div className="space-y-1">
               <h1 className="text-3xl font-semibold text-white tracking-tight">Account & Billing</h1>
               <p className="text-slate-400">Manage your subscription, payments, and organization access.</p>
            </div>
            <div className="flex items-center space-x-3">
               <Badge variant="success">Pro Plan Active</Badge>
               <span className="text-xs text-slate-500 font-mono">ID: ACCT_9921_X</span>
            </div>
          </div>

          {/* 1. Plan Summary Card */}
          <section className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl relative group">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
             <div className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Current Environment</div>
                      <h2 className="text-3xl font-bold text-white">Pro Plan <span className="text-lg font-normal text-slate-400">($29/mo)</span></h2>
                      <div className="flex items-center text-xs text-slate-500 font-mono mt-2">
                         <ActivityIcon size={12} className="mr-2 text-emerald-500 animate-pulse" />
                         ACTIVE • Renews on Nov 12, 2025
                      </div>
                   </div>
                   <div className="flex space-x-3 shrink-0">
                      <Button variant="secondary" size="sm">Cancel Subscription</Button>
                      <Button variant="primary" size="sm" icon={<ZapIcon size={14} fill="currentColor"/>}>Change Plan</Button>
                   </div>
                </div>

                {/* Usage Meters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-slate-700/50">
                   <UsageMeter 
                      label="Agents" 
                      value="5 / 10" 
                      percent={meters.agents} 
                      icon={<SparklesIcon size={14} className="text-indigo-400"/>} 
                   />
                   <UsageMeter 
                      label="Index Storage" 
                      value="12GB / 50GB" 
                      percent={meters.storage} 
                      icon={<HardDriveIcon size={14} className="text-emerald-400"/>} 
                   />
                   <UsageMeter 
                      label="API Credits" 
                      value="$15.20 / $20.00" 
                      percent={meters.api} 
                      icon={<ZapIcon size={14} className="text-amber-400"/>} 
                   />
                </div>
             </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             {/* 2. Payment Methods */}
             <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                      <CreditCardIcon size={16} className="mr-2 text-indigo-400" />
                      Payment Methods
                   </h3>
                   <button onClick={handleAddPaymentMethod} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase">+ ADD</button>
                </div>
                
                <div className="space-y-3">
                   {paymentMethods.map(pm => (
                      <div key={pm.id} className="p-4 bg-slate-800/40 border border-slate-700 rounded-2xl flex items-center justify-between group hover:border-slate-600 transition-all">
                         <div className="flex items-center space-x-4">
                            <div className="w-10 h-6 bg-slate-900 rounded border border-slate-700 flex items-center justify-center text-[10px] font-bold uppercase text-slate-500">
                               {pm.type}
                            </div>
                            <div>
                               <div className="text-sm font-bold text-white">•••• {pm.last4}</div>
                               <div className="text-[10px] text-slate-500 font-mono">EXP {pm.expiry}</div>
                            </div>
                         </div>
                         {pm.isPrimary && <div className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">PRIMARY</div>}
                      </div>
                   ))}
                </div>

                <div className="p-4 bg-indigo-900/5 border border-indigo-500/10 rounded-2xl">
                   <div className="flex items-center text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                      <ShieldIcon size={12} className="mr-2" />
                      PCI-DSS COMPLIANT
                   </div>
                   <p className="text-[10px] text-slate-600 leading-relaxed italic">
                      Transactions are secured by Stripe. Master Coda never stores full card data on local disks.
                   </p>
                </div>
             </div>

             {/* 3. Billing History */}
             <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                      <HistoryIconProxy size={16} className="mr-2 text-indigo-400" />
                      Billing History
                   </h3>
                   <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest">VIEW ALL</button>
                </div>
                
                <div className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-slate-900/50 border-b border-slate-700 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3 text-right">Amount</th>
                            <th className="px-6 py-3 text-center">Status</th>
                            <th className="px-6 py-3 text-right">Invoice</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                         {invoices.map(inv => (
                            <tr key={inv.id} className="group hover:bg-slate-800/60 transition-colors">
                               <td className="px-6 py-4 text-xs text-slate-400 font-mono uppercase">{inv.date}</td>
                               <td className="px-6 py-4">
                                  <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">{inv.description}</div>
                                  <div className="text-[9px] font-mono text-slate-600 uppercase">ID: {inv.id}</div>
                               </td>
                               <td className="px-6 py-4 text-right font-mono text-xs text-slate-300">${inv.amount.toFixed(2)}</td>
                               <td className="px-6 py-4">
                                  <div className="flex justify-center">
                                     <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                                        inv.status === 'paid' ? 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10' : 'text-amber-500 bg-amber-500/5 border-amber-500/10'
                                     }`}>{inv.status}</span>
                                  </div>
                               </td>
                               <td className="px-6 py-4 text-right">
                                  <button className="p-2 text-slate-500 hover:text-white transition-colors">
                                     <DownloadIcon size={14} />
                                  </button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>

          {/* 4. Danger Zone */}
          <section className="pt-10 border-t border-slate-800 space-y-6 pb-20">
             <div className="flex items-center space-x-3">
                <AlertTriangleIcon size={18} className="text-red-500" />
                <h3 className="text-xs font-bold text-red-500 uppercase tracking-[0.2em]">Danger Zone</h3>
             </div>
             
             <div className="bg-red-950/5 border border-red-500/20 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-1">
                   <h4 className="text-lg font-bold text-white">Delete Account</h4>
                   <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                      Permanently remove your account, all associated organization memberships, and purged all encrypted local secret metadata. This action is irreversible.
                   </p>
                </div>
                
                <div className="shrink-0 flex flex-col space-y-3">
                   {!isDeletingAccount ? (
                      <Button variant="destructive" onClick={() => setIsDeletingAccount(true)}>Delete Account</Button>
                   ) : (
                      <div className="space-y-3 animate-in slide-in-from-right-2">
                         <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Type DELETE to confirm</div>
                         <div className="flex space-x-2">
                            <input 
                               type="text" 
                               value={deleteConfirmText}
                               onChange={(e) => setDeleteConfirmText(e.target.value)}
                               className="bg-slate-900 border border-red-500/30 rounded-lg px-3 py-1.5 text-xs text-white focus:border-red-500 outline-none w-24 font-mono"
                            />
                            <Button variant="destructive" size="sm" onClick={handleDeleteAccount} disabled={deleteConfirmText !== 'DELETE'}>Confirm</Button>
                            <button onClick={() => setIsDeletingAccount(false)} className="text-slate-500 hover:text-white"><XIcon size={20}/></button>
                         </div>
                      </div>
                   )}
                </div>
             </div>
          </section>

        </div>
      </div>
      
      {/* Footer Status */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <LockIcon size={12} className="mr-2 text-indigo-400" />
               BILLING_ENCLAVE: <span className="ml-2 text-emerald-500">USER_LEVEL_SECURE</span>
            </div>
            <div className="flex items-center">
               <GlobeIcon size={12} className="mr-2 text-indigo-400" />
               STRIPE_BRIDGE: <span className="ml-2 text-slate-300 font-mono">READY</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <span className="text-slate-600 font-mono italic">SY-03_v4.2.1</span>
         </div>
      </footer>
    </div>
  );
};

const UsageMeter: React.FC<{ label: string; value: string; percent: number; icon: React.ReactNode }> = ({ label, value, percent, icon }) => (
   <div className="space-y-4">
      <div className="flex items-center justify-between">
         <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <span className="mr-2">{icon}</span>
            {label}
         </div>
         <span className="text-xs font-bold text-white font-mono">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden shadow-inner border border-slate-700">
         <div 
            className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out" 
            style={{ width: `${percent}%` }} 
         />
      </div>
   </div>
);

const HistoryIconProxy: React.FC<any> = (props) => (
   <svg
     xmlns="http://www.w3.org/2000/svg"
     width={props.size || 20}
     height={props.size || 20}
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="2"
     strokeLinecap="round"
     strokeLinejoin="round"
     {...props}
   >
     <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
     <path d="M3 3v5h5" />
     <path d="M12 7v5l4 2" />
   </svg>
 );

export default BillingSettings;
