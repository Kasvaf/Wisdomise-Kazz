import { useTranslation } from 'react-i18next';
import { useDefiProjectsQuestionPool } from 'api/staking';
import useProtocolInfo from '../../useProtocolInfo';
import { useAthena } from './athena/AthenaProvider';

export default function QuestionPool() {
  const info = useProtocolInfo();
  const { askQuestion } = useAthena();
  const { t } = useTranslation('staking');
  const questionPool = useDefiProjectsQuestionPool();

  const onClick = (templateQuestion: string) => {
    askQuestion(
      templateQuestion.replace('{{project_name}}', info.data?.name || ''),
    );
  };

  return (
    <div>
      <p className="mb-6 text-sm font-medium">{t('ask.suggested-prompts')}</p>
      <div className="flex flex-col gap-6">
        {questionPool.data?.children.map(child => (
          <div key={child.key}>
            <p className="mb-3 text-xs font-medium text-white/40">
              {child.title}
            </p>
            <div className="flex flex-col gap-3 mobile:flex-row mobile:overflow-auto">
              {child.template_questions.map(question => (
                <button
                  key={question.key}
                  onClick={() => onClick(question.template_prompt)}
                  className="whitespace-nowrap rounded-xl bg-white/5 p-3 text-left text-xs leading-none transition-colors hover:bg-white/10"
                >
                  {question.interface_prompt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
