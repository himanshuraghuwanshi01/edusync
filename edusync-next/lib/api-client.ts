import { toast } from 'sonner';

/**
 * Enhanced API Client with error handling and automatic retries
 */
class ApiClient {
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  private readonly retryAttempts = 3;
  private readonly retryDelay = 1000;

  private getToken(): string | null {
    if (globalThis.window === undefined) return null;
    return localStorage.getItem('token');
  }

  private async handleResponse(response: Response) {
    if (response.status === 401) {
      if (globalThis.window !== undefined) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        globalThis.location.href = '/login';
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

  private async callWithRetry<T = unknown>(
    endpoint: string,
    options: RequestInit,
    attempt = 0
  ): Promise<T> {
    try {
      const token = this.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (options.headers) {
        Object.assign(headers, options.headers);
      }

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

  async call<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.callWithRetry<T>(endpoint, options);
  }

  async get<T = unknown>(endpoint: string): Promise<T> {
    return this.call<T>(endpoint, { method: 'GET' });
  }

  async post<T = unknown>(endpoint: string, data: unknown): Promise<T> {
    return this.call<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T = unknown>(endpoint: string, data: unknown): Promise<T> {
    return this.call<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T = unknown>(endpoint: string): Promise<T> {
    return this.call<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
