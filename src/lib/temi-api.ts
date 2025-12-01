/**
 * 테미 로봇 API 클라이언트
 * 
 * 이 파일은 테미 로봇과 통신하기 위한 API 클라이언트 예시입니다.
 * 실제 API 엔드포인트와 인증 방식은 테미 공식 문서를 참조하세요.
 */

interface TemiConfig {
  apiUrl?: string;
  apiKey?: string;
  robotId?: string;
  robotIp?: string;
  robotPort?: number;
}

interface TemiRobotStatus {
  id: string;
  name: string;
  battery: number;
  isOnline: boolean;
  currentLocation?: string;
  networkStatus: 'connected' | 'disconnected';
}

interface TemiLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  z?: number;
}

class TemiApiClient {
  private config: TemiConfig;

  constructor(config: TemiConfig = {}) {
    this.config = {
      apiUrl: config.apiUrl || process.env.TEMI_API_URL || 'https://api.robotemi.com',
      apiKey: config.apiKey || process.env.TEMI_API_KEY,
      robotId: config.robotId || process.env.TEMI_ROBOT_ID,
      robotIp: config.robotIp || process.env.TEMI_ROBOT_IP,
      robotPort: config.robotPort || parseInt(process.env.TEMI_ROBOT_PORT || '8080'),
    };
  }

  /**
   * API 요청 헤더 생성
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }

  /**
   * 로봇 상태 조회
   */
  async getRobotStatus(): Promise<TemiRobotStatus> {
    try {
      const url = this.config.robotIp
        ? `http://${this.config.robotIp}:${this.config.robotPort}/api/status`
        : `${this.config.apiUrl}/robots/${this.config.robotId}/status`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('로봇 상태 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 로봇을 특정 위치로 이동
   */
  async moveToLocation(locationId: string): Promise<void> {
    try {
      const url = this.config.robotIp
        ? `http://${this.config.robotIp}:${this.config.robotPort}/api/navigate`
        : `${this.config.apiUrl}/robots/${this.config.robotId}/navigate`;

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          locationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`이동 명령 실패: ${response.statusText}`);
      }
    } catch (error) {
      console.error('로봇 이동 실패:', error);
      throw error;
    }
  }

  /**
   * 로봇 정지
   */
  async stop(): Promise<void> {
    try {
      const url = this.config.robotIp
        ? `http://${this.config.robotIp}:${this.config.robotPort}/api/stop`
        : `${this.config.apiUrl}/robots/${this.config.robotId}/stop`;

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`정지 명령 실패: ${response.statusText}`);
      }
    } catch (error) {
      console.error('로봇 정지 실패:', error);
      throw error;
    }
  }

  /**
   * TTS (Text-to-Speech) - 로봇이 말하기
   */
  async speak(text: string): Promise<void> {
    try {
      const url = this.config.robotIp
        ? `http://${this.config.robotIp}:${this.config.robotPort}/api/speak`
        : `${this.config.apiUrl}/robots/${this.config.robotId}/speak`;

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          text,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS 실패: ${response.statusText}`);
      }
    } catch (error) {
      console.error('TTS 실패:', error);
      throw error;
    }
  }

  /**
   * 저장된 위치 목록 조회
   */
  async getLocations(): Promise<TemiLocation[]> {
    try {
      const url = this.config.robotIp
        ? `http://${this.config.robotIp}:${this.config.robotPort}/api/locations`
        : `${this.config.apiUrl}/robots/${this.config.robotId}/locations`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`위치 목록 조회 실패: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('위치 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 맵 정보 조회
   */
  async getMap(): Promise<any> {
    try {
      const url = this.config.robotIp
        ? `http://${this.config.robotIp}:${this.config.robotPort}/api/map`
        : `${this.config.apiUrl}/robots/${this.config.robotId}/map`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`맵 정보 조회 실패: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('맵 정보 조회 실패:', error);
      throw error;
    }
  }
}

export default TemiApiClient;
export type { TemiConfig, TemiRobotStatus, TemiLocation };

