from __future__ import annotations

from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, ConfigDict, Field


class APIModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")


class TimelineStep(APIModel):
    step: str
    date: str
    completed: bool = False
    current: bool = False
    desc: str = ""


class StakeholderMatchInfo(APIModel):
    id: Optional[str] = None
    name: str
    match: int
    status: str
    distanceKm: Optional[float] = None


class MatchedStakeholders(APIModel):
    government: StakeholderMatchInfo
    university: StakeholderMatchInfo
    csr: StakeholderMatchInfo


class EvidencePayload(APIModel):
    name: str
    type: str = "application/octet-stream"
    url: Optional[str] = None
    dataBase64: Optional[str] = None


class IssueCreateRequest(APIModel):
    title: str = Field(..., min_length=2, max_length=300)
    category: Optional[str] = None
    location: str = Field(..., min_length=2, max_length=300)
    lat: Optional[float] = None
    lng: Optional[float] = None
    priority: Optional[str] = None
    description: str = Field(..., min_length=3, max_length=4000)
    citizenName: str = Field(default="नागरिक", max_length=120)
    citizenPhone: str = Field(default="", max_length=32)
    dpdpConsent: bool = True
    intakeChannel: Literal["web_app", "ivr_helpline", "csc_panchayat", "webhook"] = "web_app"
    language: str = "hi"
    affectedPeople: str = ""
    immediateDanger: str = ""
    damageDescription: str = ""
    duration: str = ""
    impactLevel: str = ""
    photoEvidence: Optional[EvidencePayload] = None
    videoEvidence: Optional[EvidencePayload] = None
    evidenceChoice: str = ""
    voiceAnswer: Dict[str, Any] = Field(default_factory=dict)
    aiConfidence: Optional[int] = None


class IvrIntakeRequest(APIModel):
    callerPhone: str = Field(..., min_length=6, max_length=20)
    transcript: str = Field(..., min_length=3, max_length=4000)
    language: str = "hi"
    district: str = "जयपुर"
    wardOrPanchayat: str = "ग्राम पंचायत"
    facilitatorId: Optional[str] = None
    channel: Literal["ivr_helpline", "csc_panchayat"] = "ivr_helpline"


class IssueValidateRequest(APIModel):
    approved: bool = True
    officerId: str = "NODAL-OFFICER-01"
    notes: str = ""
    overridePriority: Optional[Literal["high", "medium", "low"]] = None


class IssueActionRequest(APIModel):
    officerId: str = "NODAL-OFFICER-01"
    department: Optional[str] = None
    stage: Literal["verified", "routed", "in_progress", "resolved", "impact_verified"] = "in_progress"
    remarks: str = "विभाग द्वारा कार्रवाई प्रारंभ की गई।"


class IssueResponse(APIModel):
    id: str
    title: str
    titleEn: Optional[str] = None
    category: str
    categoryKey: str
    location: str
    locationEn: Optional[str] = None
    lat: float
    lng: float
    date: str
    status: str
    statusKey: str
    priority: str
    priorityKey: str
    severityScore: int
    routingTier: str
    citizenName: str
    citizenPhone: str
    dpdpConsent: bool = True
    intakeChannel: str = "web_app"
    language: str = "hi"
    description: str
    aiConfidence: int
    duplicateCount: int = 1
    duplicateOf: Optional[str] = None
    assignedDept: str
    deptId: str
    matchedStakeholders: MatchedStakeholders
    aiRoutingReasoning: List[str]
    timeline: List[TimelineStep]
    affectedPeople: str = ""
    immediateDanger: str = ""
    damageDescription: str = ""
    duration: str = ""
    impactLevel: str = ""
    photoEvidence: Optional[Dict[str, Any]] = None
    videoEvidence: Optional[Dict[str, Any]] = None
    evidenceChoice: str = ""
    voiceAnswer: Dict[str, Any] = Field(default_factory=dict)
    nlpInsights: Dict[str, Any] = Field(default_factory=dict)


class ReasoningFactor(APIModel):
    title: str
    score: str
    color: str
    desc: str


class AiReasoningResponse(APIModel):
    issueId: str
    title: str
    assignedDept: str
    aiConfidence: int
    routingTier: str
    matchedStakeholders: MatchedStakeholders
    factors: List[ReasoningFactor]
    rawReasoning: List[str]


class EvidenceUploadRequest(APIModel):
    filename: str
    contentType: str = "image/png"
    dataBase64: str


class UniversityProposalRequest(APIModel):
    challengeId: str
    projectTitle: str = Field(..., min_length=3, max_length=250)
    university: str = "MNIT Jaipur (IIC Cell)"
    studentTeam: str = Field(..., min_length=2, max_length=200)
    mentor: str = "प्रो. नोडल मेंटर"
    methodology: str = ""
    problemRef: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None


class ProjectProgressRequest(APIModel):
    progress: int = Field(..., ge=0, le=100)
    status: Optional[str] = None
    milestoneNote: Optional[str] = None


class CsrPledgeRequest(APIModel):
    opportunityId: str
    partnerName: str = Field(..., min_length=2, max_length=200)
    amountInr: int = Field(..., gt=0)
    cinOrGst: Optional[str] = None
    notes: str = ""


class PartnerVerificationRequest(APIModel):
    organizationName: str = Field(..., min_length=2, max_length=200)
    cin: Optional[str] = None
    gstin: Optional[str] = None
    csrRegistrationNo: Optional[str] = None
    focusSectors: List[str] = Field(default_factory=list)


class StakeholderCreateRequest(APIModel):
    name: str
    stakeholderType: Literal["government", "university", "csr"]
    categories: List[str]
    location: str
    lat: float = 26.9124
    lng: float = 75.7873
    capabilities: List[str] = Field(default_factory=list)
    slaHours: int = 48
    verified: bool = True


class CollaborationMilestoneRequest(APIModel):
    phase: Literal["Mentorship", "Co-design", "Funding", "Prototyping", "Testing / Pilot", "Implementation", "Impact Verification"]
    ownerType: Literal["government", "university", "csr", "citizen"]
    ownerName: str
    summary: str
    completed: bool = False


class AdminLoginRequest(APIModel):
    username: str
    password: str


class AdminLoginResponse(APIModel):
    authenticated: bool
    accessToken: str
    tokenType: str = "bearer"
    expiresIn: int
    officerId: str
    role: str = "admin"
