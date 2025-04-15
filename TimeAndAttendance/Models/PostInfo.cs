using System.ComponentModel.DataAnnotations;

namespace TimeAndAttendance.Models
{
    /// <summary>
    /// 게시 정보
    /// </summary>
    public abstract class PostInfo
    {
        /// <summary>
        /// 상속받은 모든 게시물에 공통으로 사용되는 ID (주의! 복합 키 지정 금지)
        /// </summary>
        [Key]
        public int Id { get; set; }
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


        /// <summary>
        /// 덮어쓰기
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="modifiedItem"></param>
        public abstract void Overwrite<T>(T modifiedItem) where T : PostInfo;
        public const string OverwriteErrorMessage = "Cannot overwrite with different type";
    }
}
