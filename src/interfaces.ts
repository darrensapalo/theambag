export type VisibilitySetting = "visible" | "partially_visible" | "hidden";

export type Contributor = {
  name: string;
};

export type Cause = {
  id?: string;

  // When is this for?
  date?: Date;

  // Who are we gifting to?
  recipientName?: string;

  // What is the gift?
  gift?: string;

  // What is it for?
  reason?: string;

  // What's the gang's name?
  contributorGroupName?: string;

  // Who made ambag?
  contributors?: Contributor[];

  // How visible is this cause?
  globalVisibilitySetting?: VisibilitySetting;
};
