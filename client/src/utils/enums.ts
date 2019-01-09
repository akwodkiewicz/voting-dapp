export enum CategoryPanelType {
    Existing = "existing",
    New = "new",
}

export enum PageMode {
    Form = "form",
    Fetching = "fetching",
    Finalized = "finalized",
}

export enum PrivacySetting {
    All = "all",
    Public = "public",
    Private = "private",
}

export enum ResultStatus {
    Success = "success",
    Failure = "failure",
}

export enum Validation {
    Success = "success",
    Error = "error",
    Warning = "warning",
}

export enum VoteType {
    Public = "public",
    Private = "private",
}

export enum VotingExpiryOption {
    ThreeDays = 3 * 24 * 60 * 60,
    Week = 7 * 24 * 60 * 60,
    Month = 30 * 24 * 60 * 60,
}

export enum VotingState {
    Active = "active",
    Passive = "passive",
    Disabled = "disabled",
}
