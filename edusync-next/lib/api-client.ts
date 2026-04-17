import { toast } from 'sonner';

/**
 * Enhanced API Client with error handling and automatic retries
 */
class ApiClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  private retryAttempts = 3;
  private retryDelay = 1000;

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private async handleResponse(response: Response) {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw new Error('Unauthorized - please login again');
    }

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(
        data.message || data.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }

  private async callWithRetry(
    endpoint: string,
    options: RequestInit,
    attempt = 0
  ): Promise<any> {
    try {
      const token = this.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      return await this.handleResponse(response);
    } catch (error) {
      if (attempt < this.retryAttempts && this.isRetryable(error)) {
        await new Promise(resolve =>
          setTimeout(resolve, this.retryDelay * Math.pow(2, attempt))
        );
        return this.callWithRetry(endpoint, options, attempt + 1);
      }

      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(message);
      throw error;
    }
  }

  private isRetryable(error: unknown): boolean {
    if (!(error instanceof Error)) return false;
    const message = error.message.toLowerCase();
    return (
      message.includes('fetch') ||
      message.includes('network') ||
      message.includes('timeout')
    );
  }

  async call(endpoint: string, options: RequestInit = {}) {
    return this.callWithRetry(endpoint, options);
  }

  async get(endpoint: string) {
    return this.call(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data: any) {
    return this.call(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.call(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.call(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
