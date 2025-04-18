namespace TAMBlazor.Models
{
    /// <summary>
    /// 업무일 정보
    /// </summary>
    public class BusinessDay : PostInfo
    {
        public DateOnly Date { get; set; }
        /// <summary>
        /// 유형
        /// </summary>
        public BusinessDayType Type { get; set; }
        /// <summary>
        /// 설명
        /// </summary>
        public string? Description { get; set; }


        /// <summary>
        /// 덮어쓰기
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="modifiedItem"></param>
        /// <exception cref="InvalidOperationException"></exception>
        public override void Overwrite<T>(T modifiedItem)
        {
            if (modifiedItem is BusinessDay item)
            {
                Date = item.Date;
                Type = item.Type;
                Description = item.Description;
            }
            else
                throw new InvalidOperationException(OverwriteErrorMessage);
        }
    }
}
