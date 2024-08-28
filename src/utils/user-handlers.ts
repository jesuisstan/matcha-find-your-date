import { TProfileCompleteLayout } from '@/components/modals/modal-profile-complete';
import { TUser } from '@/types/user';

export const isProfileCategoryFilled = (
  layout: TProfileCompleteLayout,
  user: TUser | undefined | null
): boolean => {
  if (!user) return false;

  if (layout === 'basics') {
    return !!(user?.firstname && user?.lastname && user?.nickname && user?.birthdate);
  } else if (layout === 'biography') {
    return !!user?.biography;
  } else if (layout === 'location') {
    return !!user?.address;
  } else if (layout === 'sexpreferences') {
    return !!user?.sex_preferences;
  } else if (layout === 'tags') {
    return user?.tags?.length! >= 3;
  } else if (layout === 'photos') {
    return user?.photos?.length! >= 1; // At least one photo
  } else return false;
};

export const isProfileComplete = (user: TUser | undefined | null): boolean => {
  if (!user) return false;

  let isComplete = false;
  if (isProfileCategoryFilled('basics', user)) {
    if (isProfileCategoryFilled('biography', user)) {
      if (isProfileCategoryFilled('location', user)) {
        if (isProfileCategoryFilled('sexpreferences', user)) {
          if (isProfileCategoryFilled('tags', user)) {
            if (isProfileCategoryFilled('photos', user)) {
              isComplete = true;
            }
          }
        }
      }
    }
  }

  return isComplete;
};
