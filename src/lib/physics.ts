// 장난감 낚싯대 및 줄(Rope) 물리 시뮬레이션

export interface Point2D {
  x: number;
  y: number;
}

export class ToyRopePhysics {
  // 낚싯대 손잡이 위치
  public handle: Point2D = { x: 200, y: 100 };
  // 줄의 중간점 (부드러운 곡선)
  public midPoint: Point2D = { x: 200, y: 160 };
  private midVel: Point2D = { x: 0, y: 0 };
  // 펜던트(장난감 끝부분) 위치 및 속도
  public pendant: Point2D = { x: 200, y: 220 };
  private pendantVel: Point2D = { x: 0, y: 0 };

  // 물리 파라미터
  private gravity: number = 0.45;
  private damping: number = 0.92;
  private stiffness: number = 0.08;
  private segmentLength: number = 55;

  // 흔들림(Shake) 감지
  public currentSpeed: number = 0;
  private lastHandle: Point2D = { x: 200, y: 100 };

  constructor(startX: number = 200, startY: number = 100) {
    this.handle = { x: startX, y: startY };
    this.midPoint = { x: startX, y: startY + this.segmentLength };
    this.pendant = { x: startX, y: startY + this.segmentLength * 2 };
    this.lastHandle = { ...this.handle };
  }

  public updateHandle(targetX: number, targetY: number) {
    const dx = targetX - this.lastHandle.x;
    const dy = targetY - this.lastHandle.y;
    this.currentSpeed = Math.sqrt(dx * dx + dy * dy);
    this.lastHandle = { x: this.handle.x, y: this.handle.y };
    this.handle.x = targetX;
    this.handle.y = targetY;
  }

  public step() {
    // 1. 중간점 물리 계산 (스프링 + 감쇠)
    const targetMidX = this.handle.x;
    const targetMidY = this.handle.y + this.segmentLength;
    const fMidX = (targetMidX - this.midPoint.x) * this.stiffness;
    const fMidY = (targetMidY - this.midPoint.y) * this.stiffness + this.gravity * 0.5;

    this.midVel.x = (this.midVel.x + fMidX) * this.damping;
    this.midVel.y = (this.midVel.y + fMidY) * this.damping;
    this.midPoint.x += this.midVel.x;
    this.midPoint.y += this.midVel.y;

    // 2. 펜던트 물리 계산 (중간점에 매달림)
    const targetPendantX = this.midPoint.x;
    const targetPendantY = this.midPoint.y + this.segmentLength;
    const fPendX = (targetPendantX - this.pendant.x) * this.stiffness;
    const fPendY = (targetPendantY - this.pendant.y) * this.stiffness + this.gravity;

    this.pendantVel.x = (this.pendantVel.x + fPendX) * this.damping;
    this.pendantVel.y = (this.pendantVel.y + fPendY) * this.damping;
    this.pendant.x += this.pendantVel.x;
    this.pendant.y += this.pendantVel.y;

    // 감쇠
    this.currentSpeed *= 0.9;
  }

  // 흔들고 있는지 판별 (속도가 일정 이상일 때)
  public isShaking(): boolean {
    return this.currentSpeed > 12;
  }
}
