interface privacySettingSchema {
    discoverSetting: number;
    postVisiblityDefault: number;
    postReplyDefault: number;
}

interface themeSchema {
    themeID: string;
    testTheme: string;
    amountTested: number;
    testAmount: number;
}

interface pinnedPostsSchema {
    _id: string;
    timestamp: number;
}

interface User {
    _id: string;
    username: string;
    usernameLc: string;
    displayName: string;
    description: string;
    profileURL: string | undefined;
    pronouns: string | undefined;
    statusTitle: string | undefined;
    userAge: number | undefined;
    creationTimestamp: number;
    followerCount: number;
    followingCount: number;
    likeCount: number;
    likedCount: number;
    pins: pinnedPostsSchema[];
    postIndexID: string;
    themeData: themeSchema;
    totalPosts: number;
    totalReplies: number;
    totalQuotes: number;
    privacySetting: privacySettingSchema;
    isBrandAccount: boolean;
    verified: boolean;
    demo: boolean | undefined;
}

export type { User };