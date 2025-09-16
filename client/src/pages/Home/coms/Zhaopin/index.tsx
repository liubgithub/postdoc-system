import { defineComponent } from 'vue';
import * as cls from '../Tongzhi/styles.css';
import { jobs, type JobInfo } from '../../demo';

export default defineComponent({
  name: 'Zhaopin',
  setup() {
    const openNews = () => {
      // 查看更多功能实现
      console.log('查看更多招聘信息');
    };

    // 格式化研究方向为一行两个
    const formatResearchDirections = (directions: string[]) => {
      return directions.map((direction, index) => (
        <span key={index}>
          {direction}
          {index % 2 === 0 && index !== directions.length - 1 ? '；' : ''}
          {index % 2 === 1 && index !== directions.length - 1 ? <br /> : ''}
        </span>
      ));
    };

    // 只取前两个招聘信息
    const displayJobs = jobs.slice(0, 2);

    return () => (
      <div>
        <div class={cls.title}>
          <div>招聘信息</div>
          <a class={cls.btn} onClick={openNews}>查看更多+</a>
        </div>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          {displayJobs.map((job: JobInfo, index: number) => (
            <div class={cls.first} style={{ width: '50%' }} key={index}>
              <a href="javascript:void(0)" onClick={() => console.log('打开详情:', job.课题组简介.平台)}>
                <div class={cls.time}>
                  <p>16</p>
                  <span>2025-09</span>
                </div>
                <div class={cls.con}>
                  <span class={cls.tit}>{job.课题组简介.平台}</span>
                  <div class={cls.sj}>
                    <font>2025-09-16</font>
                  </div>
                  <div class={cls.txt}>
                    {formatResearchDirections(job.课题组简介.研究方向)}
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  },
});