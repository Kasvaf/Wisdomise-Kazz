import { clsx } from 'clsx';
import { useSubscription } from 'api';
import {
  usePredefinedPromptsQuery,
  useUserPromptsQuery,
} from 'api/notification';
import QuestionItem from './QuestionItem';

export default function UserQuestions() {
  const userPrompts = useUserPromptsQuery();
  const currentNotificationCount = userPrompts.data?.length || 0;
  const { weeklyCustomNotificationCount, isActive } = useSubscription();
  const predefinedPrompts = usePredefinedPromptsQuery();

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-white">Your Question</p>
          <p className="mt-4 leading-none text-white/40">
            You can receive customized prompts via email every Monday.
          </p>
        </div>
        <p
          className={clsx(
            'text-right text-xl text-white mobile:basis-40',
            !isActive && 'invisible',
          )}
        >
          {currentNotificationCount} / {weeklyCustomNotificationCount}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {
          <div className="flex w-full flex-wrap items-start justify-start gap-4 rounded-lg bg-white/10 p-6 mobile:flex-col mobile:px-8">
            {predefinedPrompts.data?.map(item => (
              <div
                key={item.key}
                className="flex w-fit items-center gap-3 rounded-3xl bg-black  p-4 text-xs text-white transition-opacity"
              >
                {item.question}
              </div>
            ))}

            {userPrompts.data?.map(item => (
              <QuestionItem item={item} key={item.key} />
            ))}
          </div>
        }
      </div>
    </section>
  );
}
