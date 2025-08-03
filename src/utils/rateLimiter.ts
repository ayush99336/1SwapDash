// Rate limiting utility to prevent 429 errors
class RateLimiter {
  private queue: Array<{ fn: () => Promise<any>, resolve: (value: any) => void, reject: (error: any) => void }> = []
  private isProcessing = false
  private readonly delay: number

  constructor(delayMs: number = 1000) {
    this.delay = delayMs
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject })
      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return

    this.isProcessing = true

    while (this.queue.length > 0) {
      const { fn, resolve, reject } = this.queue.shift()!
      
      try {
        const result = await fn()
        resolve(result)
      } catch (error) {
        reject(error)
      }

      // Add delay between requests to avoid rate limiting
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.delay))
      }
    }

    this.isProcessing = false
  }
}

// Export a shared rate limiter instance
export const web3RpcLimiter = new RateLimiter(1000) // 1 second delay between requests
export const apiLimiter = new RateLimiter(500) // 500ms delay for other APIs
