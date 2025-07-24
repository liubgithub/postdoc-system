import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import * as styles from './styles.css';

export interface ProcessStep {
  status: '发起' | '审核中' | '通过' | '拒绝' | '结束';
  role: string;
  time?: string;
}

export default defineComponent({
  name: 'ProcessStatus',
  props: {
    steps: {
      type: Array as PropType<ProcessStep[]>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class={styles.processStatusContainer}>
        <div class={styles.processStatusLeft}>
          {props.steps.map((step, idx) => (
            <div class={styles.processStep} key={idx}>
              <div class={[
                styles.stepDot,
                styles[`stepDot_${step.status}` as keyof typeof styles] || '',
              ]}></div>
              {idx < props.steps.length - 1 && <div class={styles.stepLine} />}
            </div>
          ))}
        </div>
        <div class={styles.processStatusRight}>
          {props.steps.map((step, idx) => (
            <div class={styles.processCard} key={idx}>
              <div class={styles.avatar} />
              <div class={styles.info}>
                <div class={styles.namePlaceholder}></div>
                <div class={styles.role}>{step.role}</div>
              </div>
              {step.time && <div class={styles.time}>{step.time}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  },
});
