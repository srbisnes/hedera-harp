export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  provider: 'google';
  role: string;
  hederaAccountId: string;
  isAuthenticated: boolean;
  tokenExpiresAt: number;
}

export interface SwarmAgent {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatarIcon: string;
  color: string;
  status: 'active' | 'analyzing' | 'idle';
}

export interface SwarmChatMessage {
  id: string;
  sender: 'user' | 'swarm';
  text: string;
  timestamp: Date;
  agentContributions?: {
    agentId: string;
    agentName: string;
    agentRole: string;
    snippet: string;
  }[];
  suggestedActions?: {
    label: string;
    actionType: 'navigate_nodes' | 'navigate_sensors' | 'navigate_hedera' | 'toggle_all_shields' | 'simulate_tamper' | 'simulate_eavesdropping' | 'view_blueprint';
    iconName?: string;
  }[];
}
