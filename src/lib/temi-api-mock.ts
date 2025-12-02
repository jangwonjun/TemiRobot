/**
 * 테미 로봇 API 모의 클라이언트
 * 
 * 실제 로봇이 없을 때 UI를 테스트하기 위한 모의 데이터를 제공합니다.
 * 개발 중에 이 파일을 사용하여 로봇 없이도 UI를 테스트할 수 있습니다.
 */

import type { TemiRobotStatus, TemiLocation } from './temi-api';

class TemiApiMockClient {
  private mockStatus: TemiRobotStatus = {
    id: 'robot_mock_001',
    name: '테미 로봇 (모의)',
    battery: 85,
    isOnline: true,
    currentLocation: '대기실',
    networkStatus: 'connected',
  };

  private mockLocations: TemiLocation[] = [
    {
      id: 'entrance',
      name: '입구',
      x: 0.0,
      y: 0.0,
      z: 0.0,
    },
    {
      id: 'table-1-waypoint',
      name: '테이블 1',
      x: 2.5,
      y: 3.0,
      z: 0.0,
    },
    {
      id: 'table-2-waypoint',
      name: '테이블 2',
      x: 5.0,
      y: 3.0,
      z: 0.0,
    },
    {
      id: 'table-3-waypoint',
      name: '테이블 3',
      x: 2.5,
      y: 6.0,
      z: 0.0,
    },
    {
      id: 'table-4-waypoint',
      name: '테이블 4',
      x: 5.0,
      y: 6.0,
      z: 0.0,
    },
  ];

  /**
   * 로봇 상태 조회 (모의)
   */
  async getRobotStatus(): Promise<TemiRobotStatus> {
    // 실제 API 호출을 시뮬레이션하기 위해 약간의 지연 추가
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 배터리를 약간씩 변경하여 동적인 느낌 추가
    this.mockStatus.battery = Math.max(20, this.mockStatus.battery - Math.random() * 2);
    
    return { ...this.mockStatus };
  }

  /**
   * 로봇을 특정 위치로 이동 (모의)
   */
  async moveToLocation(locationId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const location = this.mockLocations.find(loc => loc.id === locationId);
    if (location) {
      this.mockStatus.currentLocation = location.name;
      console.log(`[모의] 로봇이 "${location.name}"으로 이동합니다.`);
    }
  }

  /**
   * 로봇 정지 (모의)
   */
  async stop(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('[모의] 로봇이 정지합니다.');
  }

  /**
   * TTS (Text-to-Speech) - 로봇이 말하기 (모의)
   */
  async speak(text: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[모의] 로봇이 말합니다: "${text}"`);
    // 실제로는 브라우저의 TTS API를 사용할 수도 있습니다
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      window.speechSynthesis.speak(utterance);
    }
  }

  /**
   * 저장된 위치 목록 조회 (모의)
   */
  async getLocations(): Promise<TemiLocation[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...this.mockLocations];
  }

  /**
   * 맵 정보 조회 (모의)
   */
  async getMap(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      mapId: 'map_mock_001',
      name: '사무실 1층 (모의)',
      createdAt: new Date().toISOString(),
      waypoints: this.mockLocations,
      obstacles: [],
    };
  }
}

export default TemiApiMockClient;

