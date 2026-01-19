// privacyVisibility.js

export const canUserSeeContact = (visibility, relationOk) => {
  return visibility === "EVERYONE" || (visibility === "MY_CONTACTS" && !!relationOk);
};

// rel.userHasAddedRelatedUser   -> ben onu contact olarak ekledim mi?
// rel.relatedUserHasAddedUser   -> o beni contact olarak ekledi mi?

export const canShowOnline = (me, contactPrivacy, rel) => {
  const meAllows = canUserSeeContact(
    me.privacySettings.onlineStatusVisibility,
    rel.userHasAddedRelatedUser
  );
  if (!meAllows) return false;

  const contactAllows = canUserSeeContact(
    contactPrivacy.onlineStatusVisibility,
    rel.relatedUserHasAddedUser
  );

  return contactAllows;
};

export const canShowLastSeen = (me, contactPrivacy, rel) => {
  const meAllows = canUserSeeContact(
    me.privacySettings.lastSeenVisibility,
    rel.userHasAddedRelatedUser
  );
  if (!meAllows) return false;

  const contactAllows = canUserSeeContact(
    contactPrivacy.lastSeenVisibility,
    rel.relatedUserHasAddedUser
  );

  return contactAllows;
};
