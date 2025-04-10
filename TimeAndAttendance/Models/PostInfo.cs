namespace TimeAndAttendance.Models
{
    /// <summary>
    /// 게시 정보
    /// </summary>
    public abstract class PostInfo
    {
        /// <summary>
        /// 생성 일시
        /// </summary>
        public DateTime CreatedAt { get; set; }
        /// <summary>
        /// 삭제 일시
        /// </summary>
        public DateTime? DeletedAt { get; set; }
        /// <summary>
        /// 삭제 여부
        /// </summary>
        public bool IsDeleted => DeletedAt.HasValue;
        /// <summary>
        /// 원본 게시물 ID
        /// </summary>
        public int? OriginId { get; set; }
    }
}
